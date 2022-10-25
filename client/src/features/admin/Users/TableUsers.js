import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import numberWithCommas from "../../../utils/numberWithCommas";

function createData({ id, name, email, roles, avatar }) {
  return { id, name, email, roles, avatar };
}

const columns = [
  { field: "_id", headerName: "ID" },
  { field: "name", headerName: "Tên" },
  { field: "avatar", headerName: "Avatar" },
  { field: "email", headerName: "Email" },
  { field: "roles", headerName: "Vai trò" },
  { field: "actions", headerName: "Hành động" },
];

const TableUsers = ({ users, handleDelete }) => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const rows = users.map((user) => {
    const { _id: id, name, email, roles, avatar } = user;
    return createData({ id, name, email, roles, avatar });
  });

  const handleClickDelete = (id) => {
    confirm({
      title: "Xóa người dùng",
      description: `Bạn có muốn xóa người dùng id : ${id}?`,
    })
      .then(() => {
        handleDelete(id);
      })
      .catch(() => {});
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={index !== 0 ? "right" : "inherit"}>
                <span className="font-semibold">{column.headerName}</span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="">
                <span className="">{row.id}</span>
              </TableCell>
              <TableCell align="right">
                <span className="line-clamp-2">{row.name}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <div className="flex justify-end">
                  <img
                    src={row.avatar?.url}
                    alt=""
                    className="w-[50px] h-[50px] rounded object-contain shrink-0"
                  />
                </div>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <span>{row.email}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <span>{row.roles.join(", ")}</span>
              </TableCell>

              <TableCell align="right" className="min-w-[100px]">
                <div className="flex">
                  <IconButton
                    aria-label="delete"
                    onClick={() => navigate(`/admin/users/edit/${row.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleClickDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableUsers;
