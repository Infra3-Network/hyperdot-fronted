type ControlState = {
  edit: boolean;
  settingsModalOpen: boolean;
  textWidgetModalOpen: boolean;
  visualizationModalOpen: boolean;
  editPanelModalOpen: boolean;
  editPanelIndex: number;
  editPanel?: HYPERDOT_API.DashboardPanel;
  saveLoading: boolean;
};

type StateAction = {
  setControlState: React.Dispatch<React.SetStateAction<ControlState>>;
  setDashboard: React.Dispatch<React.SetStateAction<HYPERDOT_API.Dashboard>>;
};
