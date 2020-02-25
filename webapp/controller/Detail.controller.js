sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",

], function (Controller, History,JSONModel) {
	"use strict";

	return Controller.extend("ICS_myTimeSheet.ICS_myTimeSheet.controller.Detail", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DetailView").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {

			var oArgs = oEvent.getParameter("arguments").month;
			var oViewModel = new JSONModel({
				title: oArgs
			});
			this.getView().setModel(oViewModel, "view");

			// oView.bindElement({
			// 	path: "/" + oArgs,
			// 	model: "Model"
			// });

		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("MasterView", true);
			}
		}
	});
});