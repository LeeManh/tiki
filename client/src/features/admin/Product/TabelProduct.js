import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
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

function createData({ id, name, images, price, sales, category }) {
  return { id, name, images, price, sales, category };
}

const columns = [
  { field: "name", headerName: "Tên" },
  { field: "images", headerName: "Hình ảnh" },
  { field: "price", headerName: "Giá" },
  { field: "sales", headerName: "Giảm giá (%)" },
  { field: "caterogy", headerName: "Danh mục" },
  { field: "reviews", headerName: "Nhận xét" },
  { field: "actions", headerName: "Hành Động" },
];

const TabelProduct = ({ products, handleDelete }) => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const rows = products.map((product) => {
    const { _id: id, name, images, price, sales, category } = product;
    return createData({ id, name, images, price, sales, category });
  });

  const handleClickDelete = (id) => {
    confirm({
      title: "Xóa sản phẩm",
      description: `Bạn có muốn xóa sản phẩm ${id}?`,
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
                <span className="line-clamp-3 w-[300px]">{row.name}</span>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <img
                  src={row.images[0]?.url}
                  alt=""
                  className="w-[50px] h-[50px] rounded object-contain shrink-0"
                />
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <span>{numberWithCommas(row.price)} đ</span>
              </TableCell>
              <TableCell align="right" className="min-w-[130px]">
                {row.sales}
              </TableCell>
              <TableCell align="right" className="min-w-[130px]">
                {row.category}
              </TableCell>
              <TableCell align="right" className="min-w-[130px]">
                <Link
                  className="font-semibold text-xs text-blue-400 cursor-pointer hover:underline duration-200"
                  to={`reviews/${row.id}`}
                >
                  Xem chi tiết
                </Link>
              </TableCell>
              <TableCell align="right" className="min-w-[100px]">
                <div className="flex">
                  <IconButton
                    aria-label="delete"
                    onClick={() => navigate(`/admin/products/edit/${row.id}`)}
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

export default TabelProduct;
