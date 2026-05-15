sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.RiskAssessment", {
        formatter: {
            riskState: function (sLevel) {
                switch (sLevel) {
                    case "HIGH": return "Error";
                    case "MEDIUM": return "Warning";
                    case "LOW": return "Success";
                    default: return "None";
                }
            }
        },

        onInit: function () {
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("riskToolPage");
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
