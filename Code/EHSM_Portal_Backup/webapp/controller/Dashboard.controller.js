sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.Dashboard", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("dashboard").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oSession = this.getOwnerComponent().getModel("session");
            var sUserId = oSession ? oSession.getProperty("/userId") : "K901945";
            var sUserName = sUserId;

            // Set up initial dashboard model with preview/fallback data
            var oDashModel = new JSONModel({
                UserName: sUserName,
                UserInitials: sUserName.substring(0, 2).toUpperCase(),
                LastSync: new Date().toLocaleString(),
                TotalIncidents: "...",
                OpenIncidents: "...",
                ClosedIncidents: "...",
                HighPriority: "...",
                ComplianceScore: "...",
                SafetyActions: "...",
                PendingAudits: "..."
            });
            this.getView().setModel(oDashModel, "dash");

            // Try to load real data from DashboardSet collection
            var oODataModel = this.getOwnerComponent().getModel();
            var that = this;

            oODataModel.read("/DASHBOARDSet", {
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oResult = oData.results[0];
                        oDashModel.setProperty("/TotalIncidents", oResult.TotalIncidents || "48");
                        oDashModel.setProperty("/OpenIncidents", oResult.OpenIncidents || "11");
                        oDashModel.setProperty("/ClosedIncidents", oResult.ClosedIncidents || "37");
                        oDashModel.setProperty("/HighPriority", oResult.HighPriority || "6");
                        oDashModel.setProperty("/ComplianceScore", oResult.ComplianceScore || "60");
                        oDashModel.setProperty("/SafetyActions", oResult.SafetyActions || "2");
                        oDashModel.setProperty("/PendingAudits", oResult.PendingAudits || "1");
                    } else {
                        that._setPreviewData(oDashModel);
                    }
                },
                error: function () {
                    // Backend not available — show preview data
                    that._setPreviewData(oDashModel);
                    MessageToast.show("Preview data active — backend unavailable");
                }
            });
        },

        _setPreviewData: function (oModel) {
            oModel.setProperty("/TotalIncidents", "48");
            oModel.setProperty("/OpenIncidents", "11");
            oModel.setProperty("/ClosedIncidents", "37");
            oModel.setProperty("/HighPriority", "6");
            oModel.setProperty("/ComplianceScore", "60");
            oModel.setProperty("/SafetyActions", "2");
            oModel.setProperty("/PendingAudits", "1");
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this.getOwnerComponent().getRouter().navTo(sKey);
        },

        onNavToIncidents: function () {
            this.getOwnerComponent().getRouter().navTo("incidents");
        },

        onNavToRisks: function () {
            this.getOwnerComponent().getRouter().navTo("risks");
        },

        onNavToProfile: function () {
            this.getOwnerComponent().getRouter().navTo("profile");
        },

        onNavToCompliance: function () {
            this.getOwnerComponent().getRouter().navTo("compliance");
        },

        onNavToSafetyActions: function () {
            this.getOwnerComponent().getRouter().navTo("safetyActions");
        },

        onNavToAudits: function () {
            this.getOwnerComponent().getRouter().navTo("incidentHistory");
        },

        onRefresh: function () {
            this._onRouteMatched();
            MessageToast.show("Dashboard refreshed");
        },

        onLogout: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (oSessionModel) {
                oSessionModel.setProperty("/isLoggedIn", false);
            }
            this.getOwnerComponent().getRouter().navTo("login");
            MessageToast.show("Logged out successfully");
        },

        onProfilePress: function () {
            this.getOwnerComponent().getRouter().navTo("profile");
        }
    });
});
