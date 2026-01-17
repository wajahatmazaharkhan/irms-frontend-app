import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import toast from "react-hot-toast";
import CustomNavbar from "./CustomNavbar";
import { Loader, useTitle } from "@/Components/compIndex";

function AllUsers() {
  useTitle("User Management");

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isDarkMode = document.documentElement.classList.contains("dark");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* -------------------- THEME -------------------- */
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: isDarkMode ? "dark" : "light" },
      }),
    [isDarkMode]
  );

  /* -------------------- FETCH USERS -------------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/allusers`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      setUsers(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* -------------------- DELETE USER -------------------- */
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name.toUpperCase()}?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- TABLE COLUMNS -------------------- */
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "department", headerName: "Department", width: 160 },
    {
      field: "batch",
      headerName: "Batch",
      width: 260,
      sortable: false,
      renderCell: ({ row }) => row?.batch?.name || "Not currently in any batch",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) =>
        isAdmin ? (
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(row._id, row.name);
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null,
    },
  ];

  /* -------------------- MODAL -------------------- */
  const UserDetailsModal = () => (
    <Dialog
      open={Boolean(selectedUser)}
      onClose={() => setSelectedUser(null)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Complete User Details
        <IconButton
          onClick={() => setSelectedUser(null)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {selectedUser && (
          <Stack spacing={2}>
            <Detail label="User ID" value={selectedUser._id.slice(0, 5)} />
            <Detail label="Name" value={selectedUser.name} />
            <Detail label="Email" value={selectedUser.email} />
            <Detail label="Mobile" value={selectedUser.mnumber} />
            <Detail label="Role" value={selectedUser.role} />
            <Detail label="Admin" value={String(selectedUser.isAdmin)} />
            <Detail label="Verified" value={String(selectedUser.isVerified)} />
            <Detail label="Department" value={selectedUser.department} />
            <Detail
              label="Profile Picture"
              value={selectedUser.profilePicture || "-"}
            />
            <Detail
              label="LinkedIn URL"
              value={selectedUser.linkedInURL || "-"}
            />
            <Detail
              label="Start Date"
              value={formatDate(selectedUser.startDate)}
            />
            <Detail label="End Date" value={formatDate(selectedUser.EndDate)} />
            <Detail
              label="Last Active At"
              value={formatDate(selectedUser.lastActiveAt)}
            />
            <Detail
              label="Total Time Spent (sec)"
              value={selectedUser.totalTimeSpent}
            />
            <Detail label="Total Points" value={selectedUser.totalPoints} />
            <Detail
              label="Batch Approved"
              value={String(selectedUser.batchApproved)}
            />
            <Detail
              label="Unapproved Batch"
              value={selectedUser.unapprovedBatch || "-"}
            />

            <Divider />

            <Typography variant="h6">Permissions</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {selectedUser.permissions?.length ? (
                selectedUser.permissions.map((p) => <Chip key={p} label={p} />)
              ) : (
                <Typography>No permissions</Typography>
              )}
            </Stack>

            <Divider />

            <Divider />

            <Typography variant="h6">Batch Details</Typography>
            {selectedUser.batch ? (
              <Stack spacing={1}>
                <Detail
                  label="Batch ID"
                  value={selectedUser.batch._id.slice(0, 5)}
                />
                <Detail label="Batch Name" value={selectedUser.batch.name} />
                <Detail
                  label="Batch Start"
                  value={formatDate(selectedUser.batch.startDate)}
                />
                <Detail
                  label="Batch End"
                  value={formatDate(selectedUser.batch.endDate)}
                />
                <Detail
                  label="Intern Count"
                  value={selectedUser.batch.interns?.length}
                />
                <Detail
                  label="HR Count"
                  value={selectedUser.batch.hr?.length}
                />
                <Detail label="All Tasks" value={selectedUser.batch.allTasks} />
                <Detail
                  label="Completed Tasks"
                  value={selectedUser.batch.completedTasks}
                />
              </Stack>
            ) : (
              <Typography>Not currently in any batch</Typography>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <CustomNavbar />

        <Box sx={{ height: "80vh", p: 2 }}>
          {loading ? (
            <Loader />
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              onRowClick={(params) => setSelectedUser(params.row)}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            />
          )}
        </Box>

        <UserDetailsModal />
      </div>
    </ThemeProvider>
  );
}

/* -------------------- HELPERS -------------------- */
const Detail = ({ label, value }) => (
  <Typography>
    <b>{label}:</b> {value ?? "-"}
  </Typography>
);

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

export default AllUsers;
