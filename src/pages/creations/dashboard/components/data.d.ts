type ControlState = {
  edit: boolean;
  settingsModalOpen: boolean;
  textWidgetModalOpen: boolean;
  visualizationModalOpen: boolean;
};

type StateAction = {
  setControlState: React.Dispatch<React.SetStateAction<ControlState>>;
  setDashboard: React.Dispatch<React.SetStateAction<Dashboard>>;
};
