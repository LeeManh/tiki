import * as React from "react";
import { useNavigate } from "react-router-dom";
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
import EditIcon from "@mui/icons-material/Edit";
import numberWithCommas from "../../../utils/numberWithCommas";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Collapse from "@mui/material/Collapse";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function createData({
  id,
  createdAt,
  user,
  orderItems,
  orderStatus,
  totalPrice,
}) {
  return { id, createdAt, user, orderItems, orderStatus, totalPrice };
}

const columns = [
  { field: "id", headerName: "ID" },
  { field: "createdAt", headerName: "Thời gian" },
  { field: "user", headerName: "Khách hàng" },
  { field: "orderItems", headerName: "Sản phẩm" },
  { field: "orderStatus", headerName: "Trạng thái" },
  { field: "totalPrice", headerName: "Tổng cộng" },
  { field: "actions", headerName: "Hành động" },
];

const Row = ({ row, handleDelete }) => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [openOrderItems, setOpenOrderItems] = React.useState(false);

  const handleClickDelete = (id) => {
    confirm({
      title: "Xóa đơn hàng",
      description: `Bạn có muốn xóa đơn hàng ${id}?`,
    })
      .then(() => {
        handleDelete(id);
      })
      .catch(() => {});
  };

  return (
    <React.Fragment key={row.id}>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell className="">
          <span className="line-clamp-3">{row.id}</span>
        </TableCell>
        <TableCell align="right" className="min-w-[130px]">
          <div>
            <span className="block">
              {moment(row.createdAt).format("DD-MM-YYYY")}
            </span>
            <span>{moment(row.createdAt).format("HH:mm")}</span>
          </div>
        </TableCell>
        <TableCell align="right" className="min-w-[130px]">
          {row.user}
        </TableCell>
        <TableCell align="right" className="min-w-[130px]">
          <div
            className="flex items-center justify-end cursor-pointer"
            onClick={() => setOpenOrderItems((pre) => !pre)}
          >
            <span className="font-semibold text-xs text-blue-400">
              Xem chi tiết
            </span>
            {openOrderItems ? (
              <ArrowDropUpIcon className="text-blue-400" />
            ) : (
              <ArrowDropDownIcon className="text-blue-400" />
            )}
          </div>
        </TableCell>
        <TableCell align="right" className="min-w-[130px]">
          <span
            className={`rounded py-1 px-2 border text-center text-xs font-semibold  ${
              row.orderStatus === "Processing"
                ? "text-red-400 border-red-400 bg-red-300/30"
                : "text-green-400 border-green-400 bg-green-300/30"
            }`}
          >
            {row.orderStatus === "Processing"
              ? "Đang xử lý ..."
              : "Đã giao hàng"}
          </span>
        </TableCell>
        <TableCell align="right" className="min-w-[130px]">
          <span>{numberWithCommas(row.totalPrice)} đ</span>
        </TableCell>

        <TableCell align="right" className="min-w-[100px]">
          <div className="flex">
            <IconButton
              aria-label="delete"
              onClick={() => navigate(`/admin/orders/edit/${row.id}`)}
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

      {/* Details items */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openOrderItems} timeout="auto" unmountOnExit>
            <div className="mb-2">
              <div className="font-semibold mt-2">Chi tiết sản phẩm</div>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align="right">Hình ảnh</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Giảm giá (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell
                        component="th"
                        scope="row"
                        className="max-w-[200px] line-clamp-3"
                      >
                        <span>{item.name}</span>
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex justify-end">
                          <img
                            src={item?.images[0]?.url || ""}
                            alt=""
                            className="w-[80px] h-[80px] rounded object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.sales}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const TableOrder = ({ orders, handleDelete }) => {
  const rows = orders.map((order) => {
    const {
      _id: id,
      createdAt,
      user,
      orderItems,
      orderStatus,
      totalPrice,
    } = order;
    return createData({
      id,
      createdAt,
      user,
      orderItems,
      orderStatus,
      totalPrice,
    });
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={index !== 0 ? "right" : "inherit"}
                >
                  <span className="font-semibold">{column.headerName}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <Row key={row.id} row={row} handleDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableOrder;
