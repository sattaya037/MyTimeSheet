sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",

], function (Controller, History, JSONModel) {
	"use strict";

	return Controller.extend("ICS_myTimeSheet.ICS_myTimeSheet.controller.Detail", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DetailView").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			// var list = [{type:"Charge",MD:0.00},{type:"Non-Charge",MD:16.00},{type:"Leave",MD:16.00}];
			this.oArgs = oEvent.getParameter("arguments").month;
			this.oPname = oEvent.getParameter("arguments").project;
			console.log(this.oPname)
			var TS = this.getOwnerComponent().getModel("timeSheet").getProperty("/TS");
			var dateFormat = Date.parse(this.oArgs);
			var getDate = new Date(dateFormat);
			var checkDate = getDate.getFullYear() + "" + getDate.getMonth();
			var foundTS = TS.filter(element => element.Month == getDate.getMonth() && element.Year == getDate.getFullYear());
			var MDCharge = [],
				MDNon = [],
				MDLeave = [];
			Object.entries(foundTS).forEach((obj) => {
				Object.entries(obj[1].Session).forEach((session) => {
					if (session[1].status == "Confirmed") {
						if(session[1].chargeType =="C Charge"){
							MDCharge.push(session[1].manDay);
						}else{
							MDNon.push(session[1].manDay);
						}
						

					} else if (session[1].status == "Notconfirmed") {
						MDNon.push(session[1].manDay)

					} else if (session[1].status == "Leave") {
						MDLeave.push(session[1].manDay)
					}

				})
			})
			var SumMDCharge = MDCharge.reduce((a, b) => a + b, 0);
			var SumMDNon = MDNon.reduce((a, b) => a + b, 0);
			var SumMDLeave = MDLeave.reduce((a, b) => a + b, 0);

			var oViewModel = new JSONModel({
				title: this.oArgs,
				list: [],
				MDCharge:SumMDCharge.toFixed(2),
				MDNon:SumMDNon.toFixed(2),
				MDLeave:SumMDLeave.toFixed(2)
			});
			this.getView().setModel(oViewModel, "view");
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