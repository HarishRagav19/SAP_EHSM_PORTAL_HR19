sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.IncidentManagement", {
        onInit: function () {
            // Load route and set initial data
            this.getOwnerComponent().getRouter().getRoute("incidents").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Initialize incident model with preview data
            var oIncidentModel = new JSONModel({
                INCIDENTSet: [
                    { Qmnum: "INC001", Qmtxt: "Equipment failure in Plant A", Qmdat: "2026-05-14", Qmart: "Mechanical", Swerk: "Plant A" },
                    { Qmnum: "INC002", Qmtxt: "Safety protocol violation", Qmdat: "2026-05-13", Qmart: "Safety", Swerk: "Plant B" },
                    { Qmnum: "INC003", Qmtxt: "Chemical spill incident", Qmdat: "2026-05-12", Qmart: "Chemical", Swerk: "Plant A" }
                ]
            });
            this.getView().setModel(oIncidentModel);

            // Try to load real data from OData
            var oODataModel = this.getOwnerComponent().getModel();
            var that = this;
            if (oODataModel) {
                oODataModel.read("/INCIDENTSet", {
                    success: function(oData) {
                        if (oData.results && oData.results.length > 0) {
                            oIncidentModel.setData({ INCIDENTSet: oData.results });
                        }
                    },
                    error: function() {
                        MessageToast.show("Using preview data - backend unavailable");
                    }
                });
            }
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("incidentToolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this.getOwnerComponent().getRouter().navTo(sKey);
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("incidentTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                if (sQuery) {
                    var oFilter = new Filter([
                        new Filter("Qmnum", FilterOperator.Contains, sQuery),
                        new Filter("Qmtxt", FilterOperator.Contains, sQuery)
                    ], false);
                    oBinding.filter([oFilter]);
                } else {
                    oBinding.filter([]);
                }
            }
        },

        onIncidentPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            if (oContext) {
                var sQmnum = oContext.getProperty("Qmnum");
                this.getOwnerComponent().getRouter().navTo("incidentDetail", {
                    qmnum: sQmnum
                });
            }
        },

        onReportIncident: function () {
            MessageToast.show("Reporting feature coming soon");
        },

        onLogout: function () {
            this.getOwnerComponent().getRouter().navTo("login");
            MessageToast.show("Logged out successfully");
        }
    });
});
