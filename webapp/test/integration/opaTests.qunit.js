/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ICS_myTimeSheet/ICS_myTimeSheet/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});