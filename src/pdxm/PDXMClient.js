class PDXMClient {
    constructor() {
        // ENABLE FLAG
        this.enabled = true;

        // DEBUG FLAG
        this.debug = false;


        this.port1 = null;

        this.startResolve = null;
        this.loadedResolve = null;
        this.resumeResolve = null;

        this.bonusResolve = null;
        this.bonusInfo = null;

        this._connected = false;

        this._log("constructor()");
    }

    _log(...args) {
        if (this.debug) {
            console.warn("[PDXM]", ...args);
        }
    }

    /* ======================
     * CONNECT
     * ====================== */
    connect() {
        this._log("connect() called");

        if (!this.enabled) return Promise.resolve();
        if (this._connected) return Promise.resolve();

        return new Promise((resolve) => {
            this._log("creating MessageChannel");

            const channel = new MessageChannel();
            this.port1 = channel.port1;
            this.startResolve = resolve;

            window.parent.postMessage({
                eventName: "pdxm.connectChannel",
                eventData: {
                    gameName: "Wild Wild West 2120",
                    pdxmLoadingScreen: true,
                    pdxmScreenType: "PDX"
                }
            }, "*", [channel.port2]);

            this.port1.onmessage = this.onMessage.bind(this);
        });
    }

    onMessage(event) {
        this._log("onMessage raw:", event?.data);

        if (!this.enabled) return;

        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            this._log("invalid JSON message");
            return;
        }

        const name = data.eventName?.replace("pdxm.", "");
        this._log("event received:", name, data.eventData);
        console.log(event)

        switch (name) {
            case "connected":
                this._log("connected");
                this._connected = true;
                this.startResolve?.();
                break;

            case "loadedConfirmed":
                this._log("loadedConfirmed");
                this.loadedResolve?.();
                this.loadedResolve = null;
                break;

            case "resume":
                this._log("resume received");
                this.resumeResolve?.();
                this.resumeResolve = null;
                break;

            case "completeError":
                this._log("completeError:", data.eventData);
                if (this.errorResolve) {
                    this.errorResolve(data.eventData);
                    this.errorResolve = null;
                }
                this.onCompleteError?.(data.eventData);
                break;

            case "updateBalance":
                this._log("updateBalance:", data.eventData);
                this.onUpdateBalance?.(data.eventData);
                break;

            case "toggleAction":
                this._log("toggleAction:", data.eventData);
                this.onToggleAction?.(data.eventData);
                break;

            case "setBonusInfo":
                this._log("setBonusInfo:", data.eventData);
                this.bonusInfo = data.eventData?.freespins || null;
                this.onSetBonusInfo?.(this.bonusInfo);
                break;
        }
    }

    send(event) {
        if (event.eventName != "pdxm.loadScreenProgress") {
            this._log("send:", event);
        }

        if (!this.enabled || !this.port1) return;
        this.port1.postMessage(JSON.stringify(event));
    }

    /* ======================
     * LOADING
     * ====================== */
    loadProgress(percent) {
        // this._log("loadProgress:", percent);

        this.send({
            eventName: "pdxm.loadScreenProgress",
            eventData: { percent }
        });
    }

    initialize(data) {
        this._log("initialize:", data);

        this.send({
            eventName: "pdxm.initialize",
            eventData: { data }
        });
    }

    gameLoaded() {
        this._log("gameLoaded()");

        if (!this.enabled) return Promise.resolve();

        return new Promise((resolve) => {
            this.loadedResolve = resolve;
            this.send({ eventName: "pdxm.gameLoaded" });
        });
    }

    /* ======================
     * GAMEPLAY CYCLE
     * ====================== */
    startSpin() {
        this._log("startSpin()");
        this.send({ eventName: "pdxm.startSpin" });
    }

    spinComplete(data) {
        this._log("spinComplete:", data);

        this.send({
            eventName: "pdxm.spinComplete",
            eventData: { data }
        });
    }

    animationComplete() {
        this._log("animationComplete()");

        if (!this.enabled) return Promise.resolve();

        return new Promise((resolve) => {
            this.resumeResolve = resolve;
            this.send({ eventName: "pdxm.animationComplete" });
        });
    }

    /* ======================
     * MISC EVENTS
     * ====================== */
    updateWager({ bet, denom }) {
        this._log("updateWager:", { bet, denom });

        this.send({
            eventName: "pdxm.updateWager",
            eventData: {
                bet,
                denom
            }
        });
    }

    toggleAction(action, newValue) {
        this._log("toggleAction:", action, newValue);

        this.send({
            eventName: "pdxm.toggleAction",
            eventData: {
                action,
                newValue
            }
        });
    }

    /* ======================
     * FREE SPIN
     * ====================== */
    isFreeSpinActive() {
        if (!this.bonusInfo) return false;
        
        const status = String(this.bonusInfo.status || "").toLowerCase();
        const active =
            this.bonusInfo.remaining_rounds > 0 &&
            ["active", "notstarted", "inprogress"].includes(status);

        this._log("isFreeSpinActive:", active, this.bonusInfo);

        return active;
    }

    getFreeSpinParam() {
        this._log("getFreeSpinParam()");

        if (!this.isFreeSpinActive()) return null;
        return this.bonusInfo.feature;
    }

    validateFreeSpinBetLevel(validBetLevels = []) {
        this._log("validateFreeSpinBetLevel:", validBetLevels);

        if (!this.isFreeSpinActive()) return true;

        const betLevel = Number(this.bonusInfo.bet_level);

        const isValid = validBetLevels.some(level =>
            Math.abs(Number(level) - betLevel) < 0.0001
        );

        if (!isValid) {
            this._log("Invalid FreeSpin BetLevel:", betLevel);

            this.sendError({
                source: "BONUS",
                rgsCode: 400,
                exceptionMsg: "FREEROUNDS_INVALID_BET_LEVEL"
            });

            return false;
        }

        return true;
    }

    /* ======================
     * SEND ERROR
     * ====================== */
    sendError({ source, rgsCode, exceptionMsg }) {
        this._log("sendError:", { source, rgsCode, exceptionMsg });

        // Gunakan Promise agar bisa di-await di bridge
        return new Promise((resolve) => {
            // Simpan resolve ke property class agar bisa dipanggil saat onMessage tiba
            this.errorResolve = resolve;

            this.send({
                eventName: "pdxm.error",
                eventData: { source, rgsCode, exceptionMsg }
            });
        });
    }

    /* ======================
     * CLEANUP
     * ====================== */
    destroy() {
        this._log("destroy()");

        this.port1?.close?.();
        this.port1 = null;

        this.startResolve = null;
        this.loadedResolve = null;
        this.resumeResolve = null;

        this._connected = false;
    }
}