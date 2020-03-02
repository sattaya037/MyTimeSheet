sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (Controller, History, JSONModel, Filter, FilterOperator) {
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
			var TS = this.getOwnerComponent().getModel("timeSheet").getProperty("/TS");
			var dateFormat = Date.parse(this.oArgs);
			var getDate = new Date(dateFormat);
			var Year = getDate.getFullYear();
			var Month = getDate.getMonth() + 1;
			var foundTS = TS.filter(element => element.Month == getDate.getMonth() && element.Year == getDate.getFullYear());
			var MDCharge = [],
				MDNon = [],
				MDLeave = [],
				Detail = [];
			Object.entries(foundTS).forEach((obj) => {
				Object.entries(obj[1].Session).forEach((session) => {
					// var fullDate = new Date(obj[1].Year, obj[1].Month, obj[1].Date);
					// var str =	fullDate.toLocaleDateString();
					// var Datelist = str.replace(/[.*+?^${}()|[\]\\]/g, "-");
					if (session[1].projectName == this.oPname) {
						var getDetail = {
							date: obj[1].Date,
							session: session[1]
						}
						Detail.push(getDetail)
						if (session[1].status == "Confirmed") {
							if (session[1].chargeType == "C Charge") {
								MDCharge.push(session[1].manDay);

							} else {
								MDNon.push(session[1].manDay);
							}
						} else if (session[1].status == "Notconfirmed") {
							MDNon.push(session[1].manDay)
						}
					} else {
						if (session[1].status == "Leave") {
							MDLeave.push(session[1].manDay)
						}
					}
				})
			})
			var SumMDCharge = MDCharge.reduce((a, b) => a + b, 0);
			var SumMDNon = MDNon.reduce((a, b) => a + b, 0);
			var SumMDLeave = MDLeave.reduce((a, b) => a + b, 0);
			var oViewModel = new JSONModel({
				title: this.oArgs,
				year: Year,
				month: Month,
				projectName: this.oPname,
				list: Detail,
				MDCharge: SumMDCharge.toFixed(2),
				MDNon: SumMDNon.toFixed(2),
				MDLeave: SumMDLeave.toFixed(2)
			});
			this.getView().setModel(oViewModel, "view");
		},
		onSearch: function (oEvent) {
			var aFilters = "";
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var sQueryUpLow = sQuery[0].toUpperCase() + sQuery.substr(1).toLowerCase();
				aFilters = new Filter({
					filters: [
						// new Filter("month", FilterOperator.Contains, sQueryUpLow), // filter for value 1
						// new Filter("project", FilterOperator.Contains, sQueryUpLow), // filter for value 1
						new Filter("date", FilterOperator.EQ, sQuery) // filter for value 2
					]
				});
			}
			// update list binding
			var list = this.getView().byId("timeSheetTable");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
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