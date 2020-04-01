Module.register('MMM-ProfileControl', {

  /**
   * By default, we should try to make the configuration match the demo
   * implementation. This means 3 pages, and some default enabled styles.
   */
  defaults: {
    profiles: [[]],
    showHorizontalIndicator: true,
    showVerticalIndicator: true,
    startAgainAtHorizontalEnd: true,
    startAgainAtVerticalEnd: true,
    horizontalOverflowJumpToZero: false,
    verticalOverflowJumpToZero: false,
    zeroVerticalIndexOnHorziontalChange: false,
    zeroHorizontalIndexOnVertialChange: false,
    activeBright: false,
    inactiveDimmed: true,
    inactiveHollow: true,
  },

  /**
   * Apply any styles, if we have any.
   */
  getStyles() {
    return ['font-awesome.css', 'profile-control.css'];
  },

  /**
   * Pseudo-constructor for our module. Sets the default current page to 0.
   */
  start() {
    this.curHorizontalProfileIndex = 0;
    this.curVerticalProfileIndex = 0;
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification('CONFIG', this.config)
  },

  /**
   * Render the cicles for each page, and highlighting the page we're on.
   */
  getDom() {
    const wrapper = document.createElement('div');
    if(this.config.showHorizontalIndicator){
      for (let i = 0; i < this.config.profiles.length; i += 1) {
        const circle = document.createElement('i');
  
        if (this.curHorizontalProfileIndex === i) {
          circle.className = 'fa fa-circle indicator';
          if (this.config.activeBright) {
            circle.className += ' bright';
          }
        } else {
          circle.className = 'fa indicator';
  
          if (this.config.inactiveDimmed) {
            circle.className += ' dimmed';
          }
  
          if (this.config.inactiveHollow) {
            circle.className += ' fa-circle-thin';
          } else {
            circle.className += ' fa-circle';
          }
        }
        wrapper.appendChild(circle);
  
        const self = this;
  
        // Lets people change the page by clicking on the respective circle.
        // So apparently this doesn't work if we don't call the last two methods,
        // despite those methods being called in when calling sendNotification.
        // This is likely a bug (because spamming a single button) causes rapid-
        // fire page changing, but for most cases that shouldn't be a problem.
        circle.onclick = () => {
          self.sendSocketNotification('PROFILE_SET_HORIZONTAL', i);
          self.updateDom();
        };
      }
    }

    if(this.config.showVerticalIndicator){
      if(this.config.showHorizontalIndicator && this.config.profiles[this.curHorizontalProfileIndex].length > 0){
        const seperator = document.createElement('i')
        seperator.className = 'fa fa-bullseye indicator'
        wrapper.appendChild(seperator)
      }

      for (let i = 0; i < this.config.profiles[this.curHorizontalProfileIndex].length; i += 1) {
        const circle = document.createElement('i');
  
        if (this.curVerticalProfileIndex === i) {
          circle.className = 'fa fa-circle indicator';
          if (this.config.activeBright) {
            circle.className += ' bright';
          }
        } else {
          circle.className = 'fa indicator';
  
          if (this.config.inactiveDimmed) {
            circle.className += ' dimmed';
          }
  
          if (this.config.inactiveHollow) {
            circle.className += ' fa-circle-thin';
          } else {
            circle.className += ' fa-circle';
          }
        }
        wrapper.appendChild(circle);
  
        const self = this;
  
        // Lets people change the page by clicking on the respective circle.
        // So apparently this doesn't work if we don't call the last two methods,
        // despite those methods being called in when calling sendNotification.
        // This is likely a bug (because spamming a single button) causes rapid-
        // fire page changing, but for most cases that shouldn't be a problem.
        circle.onclick = () => {
          self.sendSocketNotification('PROFILE_SET_VERTICAL', i);
          self.updateDom();
        };
      }
    }

    return wrapper;
  },

  notificationReceived: function(notification,payload) {
    if(notification === "CHANGED_PROFILE"){
      this.sendSocketNotification(notification,payload)
    }
  },

  socketNotificationReceived: function (notification, payload) {
    if(notification === "CURRENT_PROFILE"){
      this.sendNotification(notification, payload)
    } else if (notification === 'CURRENT_PROFILE_INDEX'){
      this.curHorizontalProfileIndex = payload.horizontal
      this.curVerticalProfileIndex = payload.vertical
      this.updateDom()
    }
  },

});
