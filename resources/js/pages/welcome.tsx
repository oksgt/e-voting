import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    null
                                    // <Link
                                    //     href={register()}
                                    //     className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    // >
                                    //     Register
                                    // </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="relative w-full h-full overflow-hidden rounded-lg bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 400 200"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* <!-- Background --> */}
                                <rect width="400" height="200" rx="24" fill="url(#bgGradient)" opacity="0.85" />
                                <rect width="400" height="200" rx="24" fill="white" opacity="0.15" />

                                {/* <!-- Definisi gradient --> */}
                                <defs>
                                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f0f4f8" />
                                        <stop offset="100%" stopColor="#d9e2ec" />
                                    </linearGradient>
                                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#007aff" />
                                        <stop offset="100%" stopColor="#5ac8fa" />
                                    </linearGradient>
                                </defs>

                                {/* <!-- Judul utama --> */}
                                <text
                                    x="50%"
                                    y="40%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontFamily="SF Pro Display, Helvetica, Arial, sans-serif"
                                    fontSize="42"
                                    fontWeight="600"
                                    fill="url(#textGradient)"
                                >
                                    e‑Voting
                                </text>

                                {/* <!-- Teks tambahan multi-line --> */}
                                <text
                                    x="50%"
                                    y="65%"
                                    textAnchor="middle"
                                    fontFamily="SF Pro Display, Helvetica, Arial, sans-serif"
                                    fontSize="16"
                                    fontWeight="400"
                                    fill="#6e6e73"
                                >
                                    <tspan x="50%" dy="0">
                                        Pemilihan Pengurus &amp; Pengawas
                                    </tspan>
                                    <tspan x="50%" dy="20">
                                        KKK Sakra Warih Periode 2026 - 2031
                                    </tspan>
                                </text>
                            </svg>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
