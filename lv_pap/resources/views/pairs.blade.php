<x-app-layout>
    <div class="py-8 bg-gray-100">
        <div class="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div>
                <x-authentication-card-logo />
            </div>

            <div
                class="w-full flex flex-col gap-6 sm:max-w-2xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg prose">
                @if (count($pairs) === 0)
                    <h1 class="text-center text-xl">Não há pares feitos de momento!</h1>
                @else
                    @foreach ($pairs as $pair)
                        <div class="bg-stone-100 flex flex-col gap-4 p-2 rounded-lg">
                            <h1 class="text-xl text-center m-0">{{ $pair->race->title }}</h1>
                            <p class="text-md text-center m-0">{{ $pair->athlete->user->name }} +
                                {{ $pair->guide->user->name }}</p>

                            @if ($pair->guide->user->id === Auth::user()->id || $pair->athlete->user->id === Auth::user()->id)
                                @if ($pair->guide->user->id === Auth::user()->id)
                                    <a href="{{ route('chat', ['id' => $pair->athlete->user->id]) }}">
                                        <x-new-button class="bg-green-600">
                                            CHAT
                                        </x-new-button>
                                    </a>
                                @elseif($pair->athlete->user->id === Auth::user()->id)
                                    <a href="{{ route('chat', ['id' => $pair->guide->user->id]) }}">
                                        <x-new-button class="bg-green-600">
                                            CHAT
                                        </x-new-button>
                                    </a>
                                @endif

                                <a
                                    href="{{ route('leave_pair', ['race_id' => $pair->race->id, 'athlete_id' => $pair->athlete->id, 'guide_id' => $pair->guide->id]) }}">

                                    <x-new-button class="bg-red-600">
                                        SAIR
                                    </x-new-button>
                                </a>
                            @endif
                        </div>
                    @endforeach
                @endif
            </div>
        </div>
    </div>
</x-app-layout>
