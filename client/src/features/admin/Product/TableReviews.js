import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function createData({ id, name, ratings, comment, time }) {
  return { id, name, ratings, comment, time };
}

const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Tên người đánh giá" },
  { field: "ratings", headerName: "Số sao đánh giá" },
  { field: "comment", headerName: "Bình luận" },
  { field: "time", headerName: "Thời gian" },
  { field: "actions", headerName: "Hành động" },
];

const TableReviews = ({ reviews, handleDelete }) => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const rows = reviews.map((review) => {
    const { _id: id, name, ratings, comment, time } = review;
    return createData({ id, name, ratings, comment, time });
  });

  const handleClickDelete = (idReview) => {
    confirm({
      title: "Xóa đánh giá",
      description: `Bạn có muốn xóa đánh giá id : ${idReview}?`,
    })
      .then(() => {
        handleDelete(idReview);
      })
      .catch(() => {});
  };

  if (reviews.length === 0) {
    return (
      <div className="font-semibold text-center">Chưa có đánh giá nào</div>
    );
  }

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
                <span className="line-clamp-2">{row.id}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <span>{row.name}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <span>{row.ratings}</span>
              </TableCell>
              <TableCell align="right" className="">
                <span>{row.comment}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[130px]">
                <div>
                  <span className="block">
                    {moment(row.time).format("DD-MM-YYYY")}
                  </span>
                  <span>{moment(row.time).format("HH:mm")}</span>
                </div>
              </TableCell>

              <TableCell align="right" className="min-w-[100px]">
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickDelete(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableReviews;
