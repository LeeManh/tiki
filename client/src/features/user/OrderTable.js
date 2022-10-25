import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { orderApi } from "../../api/orderApi";
import CircularProgress from "@mui/material/CircularProgress";
import numberWithCommas from "../../utils/numberWithCommas";
import Pagination from "@mui/material/Pagination";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: "8px" }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function OrderTable() {
  const [valueIndex, setValueIndex] = React.useState(0);

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    count: 0,
    limit: 0,
    orders: [],
  });
  const [page, setPage] = React.useState(1);
  const orderStatus =
    valueIndex === 0 ? "All" : valueIndex === 1 ? "Processing" : "Delivered";

  const count = Math.ceil(data.count / data.limit) || 1;

  const handleChangeTab = (event, newValue) => {
    setValueIndex(newValue);
    setPage(1);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const renderOrders = () => {
    return data.orders.map((order) => (
      <div
        key={order._id}
        className="text-sm mb-4 border-b-[1px] pb-2 cursor-pointer space-y-4"
      >
        {order.orderStatus === "Processing" ? (
          <div className="flex items-center gap-x-2">
            <ScheduleSendIcon className="text-secondary " />
            <span className="text-red-400 font-semibold">Đang xử lý...</span>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <LocalShippingIcon className="text-secondary " />
            <span className="text-green-400 font-semibold">Đã giao hàng</span>
          </div>
        )}

        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex gap-x-2 md:gap-x-4">
              <img
                src={item.images[0].url}
                alt=""
                className="w-[80px] h-[80px] object-cover border rounded shrink-0"
              />
              <div>
                <p className="line-clamp-3 font-medium mb-1">{item.name}</p>
                <div className="flex text-secondary text-xs items-center">
                  <p className="pr-2">{item.quantity} sản phẩm</p>
                  <p>x</p>
                  <p className="pl-2">{numberWithCommas(item.price)} đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="font-medium">
          Tổng cộng : {numberWithCommas(order.totalPrice)}
        </div>
      </div>
    ));
  };

  React.useEffect(() => {
    const fecthOrders = async (page, orderStatus) => {
      setLoading(true);
      try {
        const res = await orderApi.getAllOrdersUser({ page, orderStatus });

        setData({
          ...data,
          count: res.data.count,
          limit: res.data.limit,
          orders: res.data.orders,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fecthOrders(page, orderStatus);
  }, [page, orderStatus]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiButtonBase-root": {
            fontSize: "13px",
            fontWeight: 500,
            textTransform: "capitalize",
          },
        }}
      >
        <Tabs
          value={valueIndex}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab label="Tất cả đơn hàng" {...a11yProps(0)} />
          <Tab label="Đang xử lý" {...a11yProps(1)} />
          <Tab label="Đã giao" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={valueIndex} index={0}>
        {renderOrders()}
      </TabPanel>
      <TabPanel value={valueIndex} index={1}>
        {renderOrders()}
      </TabPanel>
      <TabPanel value={valueIndex} index={2}>
        {renderOrders()}
      </TabPanel>

      <Pagination
        count={count}
        page={page}
        boundaryCount={0}
        onChange={handleChangePage}
      />
    </Box>
  );
}
