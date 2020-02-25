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
				oData.timeSheet.push({
					month: month,
					year: year
				});
			})
			var result = oData.timeSheet.reduce((unique, o) => {
				if (!unique.some(obj => obj.month === o.month && obj.year === o.year)) {
					unique.push(o);
				}
				return unique;
			}, []);
			oData = {
				timeSheet: result,
			};
			var oModel = new JSONModel(oData);
			console.log(oModel)
			this.getView().setModel(oModel);
			// this.oModel.setData(TSobj);
		},
		onSearch: function (oEvent) {
			var aFilters = "";
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var sQueryUpLow = sQuery[0].toUpperCase() + sQuery.substr(1).toLowerCase();
				console.log(sQueryUpLow)
				aFilters = new Filter({
					filters: [
						new Filter("month", FilterOperator.Contains, sQueryUpLow), // filter for value 1
						new Filter("year", FilterOperator.EQ, sQuery) // filter for value 2
					]

				});
			}
			// update list binding
			var list = this.getView().byId("timeSheetList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}

	});
});