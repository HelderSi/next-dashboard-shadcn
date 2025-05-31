import { ProtectedLayout } from "../protected-layout";


export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
