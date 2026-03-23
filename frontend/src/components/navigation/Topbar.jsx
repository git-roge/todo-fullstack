export default function Topbar({ currentPage }) {
  return (
    <header className="h-16 bg-white shadow flex items-center px-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{currentPage}</h2>
    </header>
  );
}