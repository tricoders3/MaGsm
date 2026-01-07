import { BsBox, BsPeople, BsCart, BsPercent } from "react-icons/bs";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: <BsBox size={22} />,
    bg: "bg-success-subtle",
    text: "text-success",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    icon: <BsPeople size={22} />,
    bg: "bg-primary-subtle",
    text: "text-primary",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-4.2%",
    icon: <BsCart size={22} />,
    bg: "bg-danger-subtle",
    text: "text-danger",
  },
  {
    title: "Conversion Rate",
    value: "3.42%",
    change: "+8.7%",
    icon: <BsPercent size={22} />,
    bg: "bg-warning-subtle",
    text: "text-warning",
  },
];

export default function Dashboard() {
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-semibold">Dashboard Overview</h2>
        <p className="text-muted">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((item, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <small className="text-muted">{item.title}</small>
                  <h4 className="fw-bold mt-1">{item.value}</h4>
                  <small className={item.text}>
                    {item.change} vs last month
                  </small>
                </div>
                <div
                  className={`d-flex align-items-center justify-content-center rounded-3 ${item.bg} ${item.text}`}
                  style={{ width: 42, height: 42 }}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

   

      {/* Tables */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Orders</h6>
              <table className="table align-middle">
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Wireless Headphones</td>
                    <td>$129.99</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Smart Watch</td>
                    <td>$299.99</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Bob Johnson</td>
                    <td>Laptop Stand</td>
                    <td>$49.99</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Top Products</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  Wireless Headphones <span>$160,410</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Smart Watch <span>$296,003</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  USB-C Hub <span>$51,901</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
