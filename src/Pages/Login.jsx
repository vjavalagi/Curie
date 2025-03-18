import CurieLogo from "../assets/curie_no_background.png";


export default function Login() {
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6">
        <div className="text-center">
          {/* add curie logo */}
          <img src={CurieLogo} alt="Curie Logo" className="mx-auto my-4 w-40 h-24 rounded-full" />

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>

        </div>

        <form className="mt-6">
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center mb-4">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-white">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-curieBlue hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}