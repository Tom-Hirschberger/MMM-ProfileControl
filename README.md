
# MMM-ProfileControl #
This module is based on the MMM-page-indicator (https://github.com/edward-shen/MMM-page-indicator) so first of all a big thanks to edward-shen.

The aim of this module is to provide a possibility to organize profiles into horizontal areas (like pages) and vertical ones (i.e. to set an profile within MMM-CalenderExt).
It is possible to set the current vertical index or horizontal index by notifications. Additionally you can only decrement or increment these values with notifications.

If you like the module displays an indicator of the pages and and/or an indicator of the current profile.

This module is an add-on to MMM-ProfileSwitcher (https://github.com/tosti007/MMM-ProfileSwitcher). Follow the README of the module and install it first.

## Screenshots ##
![alt text](https://github.com/Tom-Hirschberger/MMM-ProfileControl/blob/master/examples/ page_one-profile_two.png "Page One -> Profile Two")

![alt text](https://github.com/Tom-Hirschberger/MMM-ProfileControl/blob/master/examples/ page_two-profile_one.png "Page Two -> Profile One")


## Installation
    cd ~/MagicMirror/modules
    git clone https://github.com/Tom-Hirschberger/MMM-ProfileControl.git
    cd MMM-ProfileControl
    npm install


## Configuration ##
To use the module insert it in the config.js file. Here is an example:

        {
			module: 'MMM-ProfileControl',
			position: 'bottom_bar',
			config: {
				profiles: [
					['pageOneEveryone', 'pageOneBirthdays'],
					['pageTwoEveryone', 'pageTwoFamily', 'pageTwoLadies']
				],
			}
		},


This results contains two pages.
    The first one contains "pageOneEveryone" and "pageOneBirthdays"
    The second "pageTwoEveryone", "pageTwoFamily" and "pageTwoLadies"


| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| profiles | The profiles which should be switched | An array of arrays | [[]] |
| showHorizontalIndicator | If true an page indicator will be displayed | boolean | true |
| showVerticalIndicator | If true an profile on page indicator will be displayed | boolean | true |
| startAgainAtHorizontalEnd | If true the pages start again at the start if the end is reached; If false the display will stay on the last page | true |
| startAgainAtVerticalEnd | If true the profiles will be rotated like the pages | true |

## Supported Notifications ##
| Notification | Payload | Description |
| ------------ | ------- | ----------- |
| PROFILE_SET_HORIZONTAL | The horizontal index | The number of the page to select (starting with 0) |
| PROFILE_SET_VERTICAL | The vertical index | The number of the profile on the current page to select (starting with 0) |
| PROFILE_INCREMENT_VERTICAL | nothing | Increment the profile number by one; if the end is already reached it will stay on this profile (or if configured start at 0) |
| PROFILE_DECREMENT_VERTICAL | nothing | Decrement the profile number by one; if the beginning is already reached it will stay on this profile (or if configured start at the end) |
| PROFILE_INCREMENT_HORIZONTAL | nothing | Increment the page number by one; if the end is already reached it will stay on this page (or if configured start at 0) |
| PROFILE_DECREMENT_HORIZONTAL | nothing | Decrement the page number by one; if the beginning is already reached it will stay on this page (or if oconfigured start at the end) |