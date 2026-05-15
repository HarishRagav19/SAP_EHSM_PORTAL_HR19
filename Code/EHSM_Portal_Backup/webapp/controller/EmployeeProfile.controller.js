sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.EmployeeProfile", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("profile").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oSession = this.getOwnerComponent().getModel("session");
            var sUserId = oSession ? oSession.getProperty("/userId") : "K901945";
            var oODataModel = this.getOwnerComponent().getModel();
            var that = this;

            // Use collection read since GET_ENTITY is not implemented
            oODataModel.read("/EMPLOYEEPROFILESet", {
                filters: [new sap.ui.model.Filter("EmpId", sap.ui.model.FilterOperator.EQ, sUserId)],
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oProfileModel = new JSONModel(oData.results[0]);
                        that.getView().setModel(oProfileModel, "prof");
                    } else {
                        that._setPreviewProfile(sUserId);
                    }
                },
                error: function () {
                    that._setPreviewProfile(sUserId);
                    MessageToast.show("Preview data — profile service unavailable");
                }
            });
        },

        _setPreviewProfile: function (sUserId) {
            var oProfileModel = new JSONModel({
                EmpId: sUserId,
                EmployeeName: "Safety Engineer",
                Designation: "Senior Safety Officer",
                Department: "EHS Department",
                Plant: "Chennai Plant",
                Gender: "M"
            });
            this.getView().setModel(oProfileModel, "prof");
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("profileToolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this.getOwnerComponent().getRouter().navTo(sKey);
        },

        onLogout: function () {
            this.getOwnerComponent().getRouter().navTo("login");
            MessageToast.show("Logged out successfully");
        }
    });
});
