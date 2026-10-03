// pdxmErrorHelper.js

/**
 * Normalize berbagai bentuk error jadi format yang aman
 */
function normalizePDXMError(error) {
    if (!error) return "Unknown Error";

    // string langsung
    if (typeof error === "string") return error;

    // axios timeout
    if (error.code === "ECONNABORTED") {
        return "Request Timeout";
    }

    // axios network
    if (error.code === "ERR_NETWORK") {
        return "Connection Error";
    }

    // format backend umum (PDXM style)
    const backendMsg =
        error?.response?.data?.responseException?.exceptionMessage;

    if (backendMsg) return backendMsg;

    // fallback message
    if (error.message) return error.message;

    return "Unknown Error";
}

/**
 * (Optional) auto detect source error
 */
function detectErrorSource(error, fallback = "SPIN") {
    if (!error) return fallback;

    // timeout axios
    if (error.code === "ECONNABORTED") return "TIMEOUT";

    // network error
    if (error.code === "ERR_NETWORK") return "TIMEOUT";

    // session expired (common case)
    const msg =
        error?.response?.data?.responseException?.exceptionMessage ||
        error?.message ||
        "";

    if (msg.toLowerCase().includes("session")) {
        return "SESSION";
    }

    return fallback;
}

/**
 * MAIN FUNCTION: kirim error ke PDXM dan tunggu response
 */
async function sendPDXMError(pdxm, { source = "SPIN", error = null, debug = false }) {
    try {
        const exceptionMsg = normalizePDXMError(error);
        const rgsCode = error?.response?.status ?? 0;

        // Sekarang 'result' akan berisi { errorType, errorAction, errorMessage }
        const result = await pdxm.sendError({
            source,
            rgsCode,
            exceptionMsg
        });

        if (debug) console.log("Instruksi PDXM:", result);
        
        return result; // Kembalikan objek instruksi lengkap
    } catch (err) {
        console.error("[PDXM] Failed:", err);
    }
}