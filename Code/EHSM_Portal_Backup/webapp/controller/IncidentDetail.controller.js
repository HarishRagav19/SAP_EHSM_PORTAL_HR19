sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("ehsm.portal.controller.IncidentDetail", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("incidentDetail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sQmnum = oEvent.getParameter("arguments").qnum; // Wait, pattern was incidents/{qmnum}
            // Check the parameter name in manifest. I used {qmnum}
            sQmnum = oEvent.getParameter("arguments").qmnum;
            
            this.getView().bindElement({
                path: "/NOTIFICATIONDETAILSet('" + sQmnum + "')",
                events: {
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        onCloseDetail: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("incidents", {}, true);
            }
        }
    });
});
