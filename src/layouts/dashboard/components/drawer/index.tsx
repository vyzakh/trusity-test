import Scrollbar from "@/components/scrollbar";
import { handleToggleDrawer } from "@/core/lib/redux/features/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/core/lib/redux/hooks";
import { Drawer, DrawerContent, DrawerHeader } from "@heroui/drawer";
import { MenuItems } from "../../utils/desktop-menu";
import Logo from "../header/logo";
import MenuItem from "../sidebar/menu-item";

export default function SideDrawer() {
  const { isDrawerOpen } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  const handleCloseDrawer = () => {
    dispatch(handleToggleDrawer());
  };

  return (
    <Drawer size="xs" isOpen={isDrawerOpen} onOpenChange={handleCloseDrawer}>
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <Logo />
            </DrawerHeader>
            <nav className="font-inter p-2">
              <div className="h-full w-full rounded-2xl">
                <Scrollbar className="h-full">
                  <ul className="flex flex-col gap-1.5">
                    {MenuItems?.map(({ key, ...item }) => {
                      return (
                        <li key={key}>
                          <MenuItem {...item} />
                        </li>
                      );
                    })}
                  </ul>
                </Scrollbar>
              </div>
            </nav>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
