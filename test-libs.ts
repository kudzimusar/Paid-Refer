import { PROPERTY_TYPE_MAP, CITY_MAP } from "./server/lib/ussd-flows.ts";

console.log("Testing USSD Lib...");
console.log("Prop Type 1:", PROPERTY_TYPE_MAP["1"]);
console.log("City 1:", CITY_MAP["1"]);

if (PROPERTY_TYPE_MAP["1"] === "house_rent" && CITY_MAP["1"] === "Harare") {
    console.log("✅ USSD Lib Basics OK");
} else {
    console.log("❌ USSD Lib Basics FAILED");
}
