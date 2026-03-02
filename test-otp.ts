import { sendSecurityOTP } from "./lib/actions";

async function test() {
    try {
        console.log("Testing sendSecurityOTP(cmm96gf4f0003hz997urzntxp)...");
        const res = await sendSecurityOTP("cmm96gf4f0003hz997urzntxp");
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
