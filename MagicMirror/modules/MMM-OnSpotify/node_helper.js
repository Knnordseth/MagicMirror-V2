/*
 * MMM-OnSpotify
 * MIT license
 *
 * By Fabrizio <3 (Fabrizz) | https://github.com/Fabrizz/MMM-OnSpotify
 */

"use strict";
const NodeHelper = require("node_helper");
const SpotifyFetcher = require("./utils/SpotifyFetcher");

module.exports = NodeHelper.create({
  start: function () {
    console.log("\x1b[46m%s\x1b[0m", `[Node Helper] Init >> ${this.name}`);
    this.fetcher = undefined;
    // Helps keping track of when the player becomes empty
    this.lastPlayerStatus = false;
    // Helps keping track of when the song actually changes
    this.lastMediaUri = null;
    // Helps keping track of when the current device target is changed
    this.lastDeviceName = null;
    // The times that an available (but empty) player has been returned by the api
    this.isPlayerInTransit = 0;
    // Configuration sent to the helper
    this.preferences = null;
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "SET_CREDENTIALS_REFRESH":
        this.fetcher = new SpotifyFetcher(payload);
        this.fetchSpotifyData("PLAYER");
        this.preferences = payload.preferences;
        break;
      case "REFRESH_PLAYER":
        this.fetchSpotifyData("PLAYER");
        break;
      case "REFRESH_USER":
        this.fetchSpotifyData("USER");
        break;
      case "REFRESH_AFFINITY":
        this.fetchSpotifyData("AFFINITY");
        break;
      case "REFRESH_QUEUE":
        this.fetchSpotifyData("QUEUE");
        break;
      case "REFRESH_RECENT":
        this.fetchSpotifyData("RECENT");
        break;
    }
  },

  fetchSpotifyData: async function (type) {
    try {
      let data = await this.fetcher.getData(type);
      if (data instanceof Error)
        return this.sendSocketNotification(
          "CONNECTION_ERRONED",
          JSON.stringify(data),
        );
      switch (type) {
        case "PLAYER":
          // CASE S1 The data is OK and the target is a filtered device
          if (
            data &&
            data.device &&
            data.device.name &&
            !this.isAllowedDevice(data.device.name)
          ) {
            this.sendSocketNotification("PLAYER_DATA", {
              statusIsPlayerEmpty: true,
              statusIsNewSong: false,
              statusIsChangeToEmptyPlayer: this.lastPlayerStatus,
              statusIsChangeToMediaPlayer: false,
              statusPlayerUpdating: false,
              statusIsDeviceChange: false,
              notAllowedDevice: data.device.name,
            });
            this.lastMediaUri = "empty";
            this.lastPlayerStatus = false;
            this.lastPlayerStatusCount = 0;
            this.lastDeviceName = "unknown";
            break;
          }
          // CASE S2 The data is OK and the target is in a private session
          if (data && data.device && data.device.is_private_session) {
            let payload = {
              /* Player data */
              playerIsPlaying: true,
              /* Device data (Some are not used yet) */
              deviceName: data.device.name,
              deviceType: data.device.type,
              deviceVolume: data.device.volume_percent,
              deviceIsPrivate: data.device.is_private_session,
              deviceId: data.device.id,
              /* Special status sync */
              statusIsPlayerEmpty: false,
              statusIsNewSong:
                this.lastMediaUri !== "privatesession" ? true : false,
              statusIsChangeToEmptyPlayer: false,
              statusIsChangeToMediaPlayer: this.lastPlayerStatus ? false : true,
              statusPlayerUpdating: false,
              statusIsDeviceChange:
                this.lastDeviceName !== data.device.name ? true : false,
              notAllowedDevice: false,
            };
            this.sendSocketNotification("PLAYER_DATA", payload);
            this.lastMediaUri = "privatesession";
            this.lastDeviceName = data.device.name;
            this.lastPlayerStatus = true;
            this.lastPlayerStatusCount = 0;
            break;
          }

          if (data && data.item) {
            // CASE 1 The data is OK and there is an ITEM in the player
            let isTrack =
              data.currently_playing_type === "track" ? true : false;
            let payload = {
              /* Player data */
              playerIsPlaying: data.is_playing,
              playerProgress: data.progress_ms,
              playerMediaType: data.currently_playing_type,
              playerShuffleState: data.shuffle_state,
              playerRepeatState: data.repeat_state,
              /* Item generics */
              itemUri: data.item.uri,
              itemName: data.item.name,
              itemDuration: data.item.duration_ms,
              itemImages: this.processImages(
                (isTrack ? data.item.album.images : data.item.show.images) ||
                  [],
              ),
              /* Item specifics (Some are not used yet) */
              itemAlbum: isTrack ? data.item.album.name : null,
              itemPublisher: isTrack ? null : data.item.show.publisher,
              itemShowName: isTrack ? null : data.item.show.name,
              itemShowDescription: isTrack ? null : data.item.show.description,
              itemArtist: isTrack ? data.item.artists[0].name : null,
              itemArtists: this.processArtists(
                (isTrack ? data.item.artists : null) || [],
              ),
              /* Device data (Some are not used yet) */
              deviceName: data.device.name,
              deviceType: data.device.type,
              deviceVolume: data.device.volume_percent,
              deviceIsPrivate: data.device.is_private_session,
              deviceId: data.device.id,
              /* Special status sync */
              statusIsPlayerEmpty: false,
              statusIsNewSong:
                this.lastMediaUri !== data.item.uri ? true : false,
              statusIsChangeToEmptyPlayer: false,
              statusIsChangeToMediaPlayer: this.lastPlayerStatus ? false : true,
              statusPlayerUpdating: false,
              statusIsDeviceChange:
                this.lastDeviceName !== data.device.name ? true : false,
              notAllowedDevice: false,
            };
            this.sendSocketNotification("PLAYER_DATA", payload);
            this.lastMediaUri = data.item.uri;
            this.lastPlayerStatus = true;
            this.lastPlayerStatusCount = 0;
            this.lastDeviceName = data.device.name;
          } else if (data && !data.item) {
            // CASE 2 The player in in transit (data OK, no ITEM)
            if (this.lastPlayerStatusCount <= 3) {
              // CASE 2A The player is available but there are no items in it. Wait 3 calls
              // This prevents an empty module when the player is loading or the playlist updating
              this.sendSocketNotification("PLAYER_DATA", {
                statusIsPlayerEmpty: true,
                statusIsNewSong: false,
                statusIsChangeToEmptyPlayer: this.lastPlayerStatus,
                statusIsChangeToMediaPlayer: false,
                statusPlayerUpdating: true,
                statusIsDeviceChange: false,
                notAllowedDevice: false,
              });
              this.lastPlayerStatusCount = this.lastPlayerStatusCount + 1;
              this.lastPlayerStatus = true;
            } else {
              this.sendSocketNotification("PLAYER_DATA", {
                // CASE 2B The player is empty but still available for more than expected. Mark it as empty
                statusIsPlayerEmpty: true,
                statusIsNewSong: false,
                statusIsChangeToEmptyPlayer: this.lastPlayerStatus,
                statusIsChangeToMediaPlayer: false,
                statusPlayerUpdating: false,
                statusIsDeviceChange: false,
                notAllowedDevice: false,
              });
              this.lastMediaUri = "empty";
              this.lastPlayerStatus = false;
              this.lastDeviceName = "unknown";
            }
            // CASE 3 There is nothing playing and there is not a player available
          } else {
            this.sendSocketNotification("PLAYER_DATA", {
              statusIsPlayerEmpty: true,
              statusIsNewSong: false,
              statusIsChangeToEmptyPlayer: this.lastPlayerStatus,
              statusIsChangeToMediaPlayer: false,
              statusPlayerUpdating: false,
              statusIsDeviceChange: false,
              notAllowedDevice: false,
            });
            this.lastMediaUri = "empty";
            this.lastPlayerStatus = false;
            this.lastPlayerStatusCount = 0;
            this.lastDeviceName = "unknown";
          }
          break;
        // ... (rest of the code above remains unchanged)

case "USER":
  if (data && data.explicit_content) { // Check if explicit_content exists before accessing its properties
    let payload = {
      country: data.country,
      name: data.display_name,
      id: data.id,
      image: data.images && data.images[0] ? data.images[0].url : null,
      product: data.product,
      filterEnabled: data.explicit_content.filter_enabled,
      filterLocked: data.explicit_content.filter_locked,
      type: data.type,
    };
    this.sendSocketNotification("USER_DATA", payload);
  }
  break;
case "AFFINITY":
  if (data && Array.isArray(data.items)) { // Check if items is an array before using forEach
    let payload = [];
    data.items.forEach((item) => {
      let images = (item.type === "track" && item.album && item.album.images) ? item.album.images : item.images;
      if (Array.isArray(images)) {
        let filteredImages = images.filter((image) => image.width >= 240 && image.width <= 360);
        let imageUrl = filteredImages.length > 0 ? filteredImages[0].url : null;
        payload.push({
          name: item.name,
          image: imageUrl,
        });
      } else {
        // Handle the case where there are no images
        payload.push({
          name: item.name,
          image: null,
        });
      }
    });
    this.sendSocketNotification("AFFINITY_DATA", payload);
  }
  break;

// ... (rest of the code below remains unchanged);

        // Future update
        case "QUEUE":
          break;
      }
    } catch (error) {
      console.error("\x1b[41m%s\x1b[0m", "[MMM-NPOS] [Node Helper] >> ", error);
    }
  },

  isAllowedDevice: function (currentDevice) {
    if (
      !this.preferences.deviceFilter ||
      this.preferences.deviceFilter.length < 1
    )
      return true;
    return this.preferences.deviceFilterExclude
      ? !this.preferences.deviceFilter.includes(currentDevice)
      : this.preferences.deviceFilter.includes(currentDevice);
  },
  processArtists: (artists) => artists.map((artist) => artist.name).join(", "),
  processImages: (images) => {
    return {
      large: images.filter(
        (image) => image.width >= 580 && image.width <= 720,
      )[0].url,
      medium: images.filter(
        (image) => image.width >= 240 && image.width <= 360,
      )[0].url,
      thumb: images.filter(
        (image) => image.width >= 24 && image.width <= 200,
      )[0].url,
    };
  },
});
