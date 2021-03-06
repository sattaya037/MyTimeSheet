sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ICS_myTimeSheet.ICS_myTimeSheet.controller.Master", {
		onInit: function () {
			var TS = this.getOwnerComponent().getModel("timeSheet").getProperty("/TS");
			var TSEntry = Object.entries(TS);
			var oData = {
				timeSheet: [],
			};
			TSEntry.forEach((obj) => {
				var fullDate = new Date(obj[1].Year, obj[1].Month, obj[1].Date);
				var month = fullDate.toLocaleString('default', {
					month: 'short'
				});
				var year = fullDate.getFullYear();
				Object.entries(obj[1].Session).forEach((session) => {
					if (session[1].projectName) {
						oData.timeSheet.push({
							month: month,
							year: year,
							project: session[1].projectName,
							MD: []
						});
						var findIndex = oData.timeSheet.findIndex(obj => obj.month === month && obj.year === year && obj.project === session[1].projectName);
						oData.timeSheet[findIndex].MD.push(session[1].manDay)
						console.log()
							// oData.timeSheet.MD.push(session[1].manDay)
					}
				})

			})
			var result = oData.timeSheet.reduce((unique, o) => {
				if (!unique.some(obj => obj.month === o.month && obj.year === o.year && obj.project === o.project)) {
					var SumMDCharge = o.MD.reduce((a, b) => a + b, 0);
					o.MD = SumMDCharge
						// console.log(SumMDCharge)
					unique.push(o);
				}
				return unique;
			}, []);
			// var SumMDCharge = result.reduce((a, b) => a.MD + b.MD);
			// console.log(a)
			// console.log(SumMDCharge)

			oData = {
				timeSheet: result,
			};
			console.log(result)

			// var SumMDCharge = MDCharge.reduce((a, b) => a + b, 0);
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			// this.oModel.setData(TSobj);
		},
		onSearch: function (oEvent) {
			var aFilters = "";
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var sQueryUpLow = sQuery[0].toUpperCase() + sQuery.substr(1).toLowerCase();
				aFilters = new Filter({
					filters: [
						new Filter("month", FilterOperator.Contains, sQueryUpLow), // filter for value 1
						new Filter("project", FilterOperator.Contains, sQueryUpLow), // filter for value 1
						new Filter("year", FilterOperator.EQ, sQuery) // filter for value 2
					]
				});
			}
			// update list binding
			var list = this.getView().byId("timeSheetList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onItemPress: function (oEvent) {

			var oItem, oCtx, loRouter, path;
			oItem = oEvent.getSource();
			loRouter = sap.ui.core.UIComponent.getRouterFor(this);
			loRouter.navTo("DetailView", {
				month: oItem.getTitle(),
				project: oItem.getAttributes()[0].getText()
			});

		},

	});
});