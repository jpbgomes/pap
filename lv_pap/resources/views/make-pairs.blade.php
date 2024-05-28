<x-app-layout>
    <div class="py-8 bg-gray-100">
        <div class="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div>
                <x-authentication-card-logo />
            </div>

            {{-- <div class="w-[450px] flex flex-col gap-12 sm:max-w-2xl mt-6 overflow-hidden "> --}}
            <div
                class="max-w-[1140px] w-full flex flex-wrap justify-center items-start self-center gap-12 pt-8 drop-shadow-lg prose">

                @if (count($races) === 0)
                    <h1 class="text-center text-xl m-0">Não estás inscrito em nenhuma corrida!</h1>
                @else
                    @foreach ($races as $race)
                        <div
                            class="w-[430px] bg-white flex flex-col justify-between gap-6 py-6 px-6 rounded-lg shadow-xl">

                            <h1 class="text-center m-0 my-2 text-2xl">{{ $race->title }}</h1>

                            <img src="{{ $race->image_path }}" alt="{{ $race->name }}" class="m-0 rounded-md">

                            <div class="flex flex-col gap-2 mt-3">
                                @if (count($participants[$race->title]) === 0)
                                    <x-new-button class="bg-red-600 mb-2">
                                        NÃO HÁ PARTICIPANTES DISPONÍVEIS
                                    </x-new-button>
                                @else
                                    @if (Auth::user()->runner_type === 'guia')
                                        <a
                                            href="{{ route('join_pair', ['race_id' => $race->id, 'athlete_id' => 'random', 'guide_id' => 'my_id']) }}">
                                            <x-new-button class="bg-red-600 mb-2">
                                                ALEATÓRIO
                                            </x-new-button>
                                        </a>
                                    @else
                                        <a
                                            href="{{ route('join_pair', ['race_id' => $race->id, 'athlete_id' => 'my_id', 'guide_id' => 'random']) }}">
                                            <x-new-button class="bg-red-600 mb-2">
                                                ALEATÓRIO
                                            </x-new-button>
                                        </a>
                                    @endif


                                    @foreach ($participants[$race->title] as $participant)
                                        @if ($participant->user->runner_type === 'guia')
                                            <a href="{{ route('join_pair', ['race_id' => $race->id, 'athlete_id' => 'my_id', 'guide_id' => $participant->id]) }}"
                                                class="no-underline">
                                                <x-new-button
                                                    class="uppercase flex justify-start items-center gap-5 h-20">
                                                    @if ($participant->user)
                                                        <img src="{{ $participant->user->profile_photo_path }}"
                                                            alt="{{ $participant->user->name }}"
                                                            class="w-16 h-16 rounded-full object-cover ml-8">
                                                        <p>{{ $participant->user->name }}</p>
                                                    @else
                                                        Participant User Not Found
                                                    @endif
                                                </x-new-button>
                                            </a>
                                        @else
                                            <a href="{{ route('join_pair', ['race_id' => $race->id, 'athlete_id' => $participant->id, 'guide_id' => 'my_id']) }}"
                                                class="no-underline">
                                                <x-new-button
                                                    class="uppercase flex justify-start items-center gap-5 h-20">
                                                    @if ($participant->user)
                                                        <img src="{{ $participant->user->profile_photo_path }}"
                                                            alt="{{ $participant->user->name }}"
                                                            class="w-16 h-16 rounded-full object-cover ml-8">
                                                        <p>{{ $participant->user->name }}</p>
                                                    @else
                                                        Participant User Not Found
                                                    @endif
                                                </x-new-button>
                                            </a>
                                        @endif
                                    @endforeach
                                @endif
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>
    </div>
</x-app-layout>
