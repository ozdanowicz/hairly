const Pagination = () => {
    return (
      <nav aria-label="Page navigation example" className="flex justify-center my-4">
        <ul className="list-style-none flex space-x-2">
          <li>
            <a
              className="pointer-events-none relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-gray-400 transition duration-300"
            >
              Previous
            </a>
          </li>
          <li>
            <a
              className="relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-gray-700 transition duration-300 hover:bg-rose-100 focus:bg-rose-100 focus:text-rose-700 focus:outline-none active:bg-rose-100 active:text-rose-700"
              href="#!"
            >
              1
            </a>
          </li>
          <li aria-current="page">
            <a
              className="relative block rounded-full bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 transition duration-300 focus:outline-none"
              href="#!"
            >
              2
              <span
                className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
              >
                (current)
              </span>
            </a>
          </li>
          <li>
            <a
              className="relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-gray-700 transition duration-300 hover:bg-rose-100 focus:bg-rose-100 focus:text-rose-700 focus:outline-none active:bg-rose-100 active:text-rose-700"
              href="#!"
            >
              3
            </a>
          </li>
          <li>
            <a
              className="relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-gray-700 transition duration-300 hover:bg-rose-100 focus:bg-rose-100 focus:text-rose-700 focus:outline-none active:bg-rose-100 active:text-rose-700"
              href="#!"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Pagination;
  