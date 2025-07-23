import { Outlet } from "react-router";
import Logo from "../dashboard/components/header/logo";

export default function AuthLayout() {
  return (
    <section className="flex grow flex-col">
      <div className="grid grow grid-cols-2">
        <div className="h-full bg-green-200">
          <div className="h-full bg-[#F8FAFE]">
            <div
              className="h-full bg-bottom bg-no-repeat pt-[30%]"
              style={{ backgroundImage: "url(/auth-bg.png)" }}
            >
              <h1 className="ms-[20%] text-4xl leading-snug font-bold tracking-normal">
                <span className="text-primary">Welcome to</span>
                <br />
                <span className="text-secondary">Launchpad</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="h-full">
          <div className="mx-auto flex h-full max-w-sm flex-col justify-center space-y-5">
            <Logo />
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}
