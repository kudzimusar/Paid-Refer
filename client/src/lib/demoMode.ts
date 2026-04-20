export const isDemoMode = () => {
  return (
    window.location.hostname.includes("github.io") ||
    localStorage.getItem("DEMO_MODE") === "true"
  );
};

export const enableDemoMode = () => {
  localStorage.setItem("DEMO_MODE", "true");
};

export const disableDemoMode = () => {
  localStorage.removeItem("DEMO_MODE");
};
