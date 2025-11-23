import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen bg-black text-green-500 font-mono p-4 justify-center items-center">
      <div className="border border-red-900 p-8 rounded max-w-md w-full text-center bg-black/90">
        <h2 className="text-6xl mb-4 text-red-600 font-bold tracking-tighter animate-pulse">404</h2>
        <div className="w-full h-px bg-red-900 mb-6"></div>
        <p className="mb-8 text-xl text-red-400 uppercase tracking-widest">System Error: Resource Not Found</p>
        <p className="mb-8 text-green-700 text-sm text-left font-mono">
          &gt; diag --verbose<br/>
          Target coordinates invalid.<br/>
          Sector empty.<br/>
          Path integrity compromised.<br/>
        </p>
        <Link
          href="/"
          className="inline-block border border-green-500 text-green-500 px-6 py-3 hover:bg-green-500 hover:text-black transition-all duration-300 uppercase font-bold tracking-wider text-sm"
        >
          Return to Terminal
        </Link>
      </div>
    </div>
  );
}
