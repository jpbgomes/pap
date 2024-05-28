<script>
    function toggleHamburger() {
        var hamburgerContent = document.getElementById('HamburgerContent');
        hamburgerContent.classList.toggle('hidden');
    }
</script>

<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <!-- Primary Navigation Menu -->
    <div class="max-w-[1140px] mx-auto px-6 lg:px-0">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('welcome') }}">
                        <x-application-mark class="block h-10 w-auto" />
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="hidden space-x-8 nav:-my-px nav:ml-10 nav:flex">
                    @if (Auth::check())
                        <x-nav-link href="{{ route('dashboard') }}" :active="request()->routeIs('dashboard')">
                            {{ __('Painel') }}
                        </x-nav-link>
                    @endif

                    <x-nav-link href="{{ route('races') }}" :active="request()->routeIs('races')">
                        {{ __('Corridas') }}
                    </x-nav-link>

                    @if (Auth::check())
                        {{-- @can('create_races') --}}
                        {{-- @endcan --}}
                        <x-nav-link href="{{ route('create_races') }}" :active="request()->routeIs('create_races')">
                            {{ __('Criação') }}
                        </x-nav-link>
                    @endif


                    <x-nav-link href="{{ route('biography') }}" :active="request()->routeIs('biography')">
                        {{ __('Biografia') }}
                    </x-nav-link>

                    <x-nav-link href="{{ route('faq') }}" :active="request()->routeIs('faq')">
                        {{ __('FAQ') }}
                    </x-nav-link>
                </div>
            </div>

            <div class="hidden nav:flex nav:items-center nav:ml-6">
                <div class="ml-3 relative">
                    @if (Auth::check())
                        <span class="inline-flex items-center gap-2 rounded-md">
                            @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                                <a href="{{ route('api-tokens.index') }}">
                                    <button type="button"
                                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-white bg-blue-500 hover:text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-500 active:bg-blue-700 transition">
                                        API
                                    </button>
                                </a>
                            @endif

                            <form method="POST" action="{{ route('logout') }}" id="logout-form">
                                @csrf
                                <button type="submit"
                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-white bg-blue-500 hover:text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-500 active:bg-blue-700 transition">
                                    Logout
                                </button>
                            </form>

                            @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                                <a href="{{ route('profile.show') }}">
                                    <button
                                        class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                                        @if (Auth::user()->profile_photo_path !== null)
                                            @php
                                                $profilePhotoPath = Auth::user()->profile_photo_path;
                                                $afterStorage = Str::after(
                                                    $profilePhotoPath,
                                                    'http://localhost/storage/',
                                                );
                                                $startsWithHTTP = Str::startsWith($afterStorage, [
                                                    'http://',
                                                    'https://',
                                                ]);
                                                if ($startsWithHTTP) {
                                                    $finalUrl = $afterStorage;
                                                } else {
                                                    $finalUrl = env('APP_URL') . '/' . ltrim($afterStorage, '/');
                                                }
                                            @endphp

                                            <img src="{{ $finalUrl }}" alt="{{ Auth::user()->name }}"
                                                class="rounded-full h-10 w-10 object-cover">
                                        @else
                                            @php
                                                $firstLetter = substr(Auth::user()->name, 0, 1);
                                                $finalUrl = "https://ui-avatars.com/api/?name=$firstLetter&color=7F9CF5&background=EBF4FF";
                                            @endphp
                                            <img src="{{ $finalUrl }}" alt="{{ Auth::user()->name }}"
                                                class="rounded-full h-10 w-10 object-cover">
                                        @endif
                                    </button>
                                </a>
                            @else
                                <span class="inline-flex rounded-md">
                                    <a href="{{ route('profile.show') }}">
                                        <button type="button"
                                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition ease-in-out duration-150">
                                            {{ Auth::user()->name }}

                                            <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </button>
                                    </a>
                                </span>
                            @endif
                        </span>
                    @else
                        <span class="inline-flex gap-2 rounded-md">
                            <a href="{{ route('login') }}">
                                <button type="button"
                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-white bg-blue-500 hover:text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-500 active:bg-blue-700 transition">
                                    Login

                                    <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </a>

                            <a href="{{ route('register') }}">
                                <button type="button"
                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-white bg-blue-500 hover:text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-500 active:bg-blue-700 transition">
                                    Register
                                </button>
                            </a>
                        </span>
                    @endif

                </div>
            </div>

            <!-- Hamburger -->
            <div class="-mr-2 flex items-center nav:hidden">
                <button @click="open = ! open"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{ 'hidden': open, 'inline-flex': !open }" class="inline-flex"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{ 'hidden': !open, 'inline-flex': open }" class="hidden" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div id="HamburgerContent" :class="{ 'block': open, 'hidden': !open }" class="hidden nav:hidden">
        <div class="pt-2 pb-3 space-y-1">

            @if (Auth::check())
                <x-responsive-nav-link href="{{ route('dashboard') }}" :active="request()->routeIs('dashboard')">
                    {{ __('Painel') }}
                </x-responsive-nav-link>
            @endif

            <x-responsive-nav-link href="{{ route('races') }}" :active="request()->routeIs('races')">
                {{ __('Corridas') }}
            </x-responsive-nav-link>

            @can('create_races')
                <x-responsive-nav-link href="{{ route('create_races') }}" :active="request()->routeIs('create_races')">
                    {{ __('Criação') }}
                </x-responsive-nav-link>
            @endcan

            <x-responsive-nav-link href="{{ route('biography') }}" :active="request()->routeIs('biography')">
                {{ __('Biografia') }}
            </x-responsive-nav-link>

            <x-responsive-nav-link href="{{ route('faq') }}" :active="request()->routeIs('faq')">
                {{ __('FAQ') }}
            </x-responsive-nav-link>
        </div>

        <!-- Responsive Settings Definições -->
        <div class="pt-4 pb-1 border-t border-gray-200">
            <div class="flex items-center px-4">
                @if (Auth::check())
                    @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                        <div class="shrink-0 mr-3">
                            @if (Auth::user()->profile_photo_path !== null)
                                @php
                                    $profilePhotoPath = Auth::user()->profile_photo_path;
                                    $afterStorage = Str::after($profilePhotoPath, 'http://localhost/storage/');
                                    $startsWithHTTP = Str::startsWith($afterStorage, ['http://', 'https://']);

                                    if ($startsWithHTTP) {
                                        $finalUrl = $afterStorage;
                                    } else {
                                        $finalUrl = env('APP_URL') . '/' . ltrim($afterStorage, '/');
                                    }
                                @endphp

                                <img src="{{ $finalUrl }}" alt="{{ Auth::user()->name }}"
                                    class="rounded-full h-10 w-10 object-cover">
                            @else
                                @php
                                    $firstLetter = substr(Auth::user()->name, 0, 1);
                                    $finalUrl = "https://ui-avatars.com/api/?name=$firstLetter&color=7F9CF5&background=EBF4FF";
                                @endphp

                                <img src="{{ $finalUrl }}" alt="{{ Auth::user()->name }}"
                                    class="rounded-full h-10 w-10 object-cover">
                            @endif
                        </div>
                    @endif

                    <div>
                        <div class="font-medium text-base text-gray-800">{{ Auth::user()->name }}</div>
                        <div class="font-medium text-sm text-gray-500">{{ Auth::user()->email }}</div>
                    </div>
                @endif
            </div>

            <div class="mt-3 space-y-1">
                @if (Auth::check())
                    <!-- Account Management -->
                    <x-responsive-nav-link href="{{ route('profile.show') }}" :active="request()->routeIs('profile.show')">
                        {{ __('Definições') }}
                    </x-responsive-nav-link>

                    @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                        <x-responsive-nav-link href="{{ route('api-tokens.index') }}" :active="request()->routeIs('api-tokens.index')">
                            {{ __('API Tokens') }}
                        </x-responsive-nav-link>
                    @endif

                    <!-- Authentication -->
                    <form method="POST" action="{{ route('logout') }}" x-data>
                        @csrf

                        <x-responsive-nav-link href="{{ route('logout') }}" @click.prevent="$root.submit();">
                            {{ __('Terminar Sessão') }}
                        </x-responsive-nav-link>
                    </form>

                    <!-- Team Management -->
                    @if (Laravel\Jetstream\Jetstream::hasTeamFeatures())
                        <div class="border-t border-gray-200"></div>

                        <div class="block px-4 py-2 text-xs text-gray-400">
                            {{ __('Manage Team') }}
                        </div>

                        <!-- Team Settings -->
                        <x-responsive-nav-link href="{{ route('teams.show', Auth::user()->currentTeam->id) }}"
                            :active="request()->routeIs('teams.show')">
                            {{ __('Team Settings') }}
                        </x-responsive-nav-link>

                        @can('create', Laravel\Jetstream\Jetstream::newTeamModel())
                            <x-responsive-nav-link href="{{ route('teams.create') }}" :active="request()->routeIs('teams.create')">
                                {{ __('Create New Team') }}
                            </x-responsive-nav-link>
                        @endcan

                        <!-- Team Switcher -->
                        @if (Auth::user()->allTeams()->count() > 1)
                            <div class="border-t border-gray-200"></div>

                            <div class="block px-4 py-2 text-xs text-gray-400">
                                {{ __('Switch Teams') }}
                            </div>

                            @foreach (Auth::user()->allTeams() as $team)
                                <x-switchable-team :team="$team" component="responsive-nav-link" />
                            @endforeach
                        @endif
                    @endif
                @else
                    <x-responsive-nav-link href="{{ route('login') }}" :active="request()->routeIs('login')">
                        {{ __('Login') }}
                    </x-responsive-nav-link>

                    <x-responsive-nav-link href="{{ route('register') }}" :active="request()->routeIs('register')">
                        {{ __('Register') }}
                    </x-responsive-nav-link>
                @endif
            </div>
        </div>
    </div>
</nav>
