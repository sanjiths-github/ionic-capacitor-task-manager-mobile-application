import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.taskflow.mobile",
  appName: "TaskFlow",
  webDir: "web",
  server: {
    androidScheme: "https",
    hostname: "localhost",
    cleartext: process.env.TASKFLOW_DEV_HTTP === "1",
  },
  android: { allowMixedContent: process.env.TASKFLOW_DEV_HTTP === "1" },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#ffffff",
    },
    Keyboard: { resize: "body" },
  },
};
export default config;
