sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.Login", {
        onInit: function () {
            // Set preview credentials for development
            var oView = this.getView();
            if (oView.byId("empId")) {
                oView.byId("empId").setValue("K901929");
            }
            if (oView.byId("password")) {
                oView.byId("password").setValue("password123");
            }
        },

        onLogin: function () {
            var oView = this.getView();
            var sEmpId = oView.byId("empId").getValue();
            var sPassword = oView.byId("password").getValue();

            if (!sEmpId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password");
                return;
            }

            // Store user info in a local model for session management
            var oSessionModel = new JSONModel({
                userId: sEmpId,
                userName: sEmpId,
                isLoggedIn: true
            });
            this.getOwnerComponent().setModel(oSessionModel, "session");

            // Navigate to dashboard
            MessageToast.show("Welcome, " + sEmpId);
            setTimeout(function () {
                this.getOwnerComponent().getRouter().navTo("dashboard");
            }.bind(this), 500);
        }
    });
});
