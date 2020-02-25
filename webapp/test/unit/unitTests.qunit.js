/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ICS_myTimeSheet/ICS_myTimeSheet/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});