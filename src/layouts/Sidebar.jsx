import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiActivity, FiSettings } from "react-icons/fi";
import ASSETS from "../assets";

const mainMenu = [
  { label: "Dashboard", path: "/", icon: ASSETS.dashBoard, exact: true },
  { label: "Blockchain", path: "/blocks", icon: ASSETS.blockchain },
  { label: "Tokens", path: "/token/erc20-transfers", icon: ASSETS.tokens },
  {
    label: "Developers",
    path: "/services/verify-contract",
    icon: ASSETS.developers,
  },
  { label: "SDK Docs", path: "/sdk", icon: ASSETS.sdkDocs },
];

const systemMenu = [
  { label: "Network Status", path: "/mempoolspace", icon: FiActivity },
  { label: "Settings", path: "/settings", icon: FiSettings },
];

const menuItemClass =
  "group flex items-center rounded-lg h-[45px] px-[10px] py-[12px] text-sm font-medium transition-all duration-200";

const renderMenuIcon = (icon, label) => {
  if (typeof icon === "string") {
    return (
      <img src={icon} alt={`${label} icon`} className="h-4 w-4 shrink-0" />
    );
  }

  const Icon = icon;
  return <Icon className="h-4 w-4 shrink-0" />;
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${"w-[256px] min-w-[256px]"} h-screen bg-[#171A22] text-slate-300 transition-all duration-300`}
    >
      <div className="flex h-full flex-col">
        <div
          className={`border-b border-[#62748E] py-[12px] h-[81.2px] ${
            isCollapsed
              ? "flex justify-center"
              : "flex items-center justify-center px-[12px]"
          }`}
        >
          <button
            type="button"
            // onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center rounded-md transition-opacity hover:opacity-90 ${
              isCollapsed ? "justify-center" : "justify-center gap-[12px]"
            }`}
          >
            <div className="flex items-center justify-center">
              <img
                src={isCollapsed ? ASSETS.closedLogo : ASSETS.LogoBackground}
                alt="RYT Network"
                className={isCollapsed ? "h-10 w-10" : ""}
              />
            </div>
            {!isCollapsed && (
              <h2 className="text-[20px] font-[700] text-white">RYT Network</h2>
            )}
          </button>
        </div>

        {/* <div>
          {!isCollapsed && (
            <p className="mb-[12px] px-[35px] text-[10px] font-semibold tracking-[1px] text-[#62748E]">
              MAIN MENU
            </p>
          )}
          <nav className={isCollapsed ? "px-[12px]" : "px-[24px]"}>
            {mainMenu.map((item) => {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    isActive
                      ? `${menuItemClass} ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } bg-[#3B7EE8] text-white rounded-[6px]`
                      : `${menuItemClass} ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } mt-[10px] text-[14px] text-[#8197B6] hover:bg-[#16233a] hover:text-slate-100`
                  }
                >
                  {renderMenuIcon(item.icon, item.label)}
                  {!isCollapsed && (
                    <span className="text-[14px] font-[600]">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className={isCollapsed ? "mt-8 px-[12px]" : "mt-8 px-[24px]"}>
          {!isCollapsed && (
            <p className="mb-3 px-1 text-[11px] font-semibold tracking-[0.18em] text-[#62748E]">
              SYSTEM
            </p>
          )}
          <nav className="space-y-1.5">
            {systemMenu.map((item) => {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? `${menuItemClass} ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } bg-[#3B7EE8] text-white rounded-[6px]`
                      : `${menuItemClass} ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } mt-[10px] text-[14px] text-[#8197B6] hover:bg-[#16233a] hover:text-slate-100`
                  }
                >
                  {renderMenuIcon(item.icon, item.label)}
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
