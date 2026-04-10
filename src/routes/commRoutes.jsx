import {
  CommHomePage,
  ManageTickets,
  CommRanking,
} from "../CommunicationTeam/commIndex";

export const commRoutes = [
  { path: "/commhomepage", element: <CommHomePage /> },
  { path: "/commtickets", element: <ManageTickets /> },
  { path: "/commrank", element: <CommRanking /> },
];
