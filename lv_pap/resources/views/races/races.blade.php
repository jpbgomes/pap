<x-app-layout>
    <div class="flex flex-col items-center justify-center py-12 px-4 lg:px-0">
        <x-title text="CORRIDAS" />

        <div
            class="max-w-[1140px] w-full flex flex-wrap justify-center items-center self-center gap-12 pt-8 drop-shadow-lg">

            @foreach ($races as $race)
                <div
                    class="w-full sm:w-[430px] bg-white flex flex-col justify-between gap-4 py-6 px-6 rounded-lg shadow-xl">
                    <h1 class="font-bold text-center text-xl">{{ $race->title }}</h1>

                    <div class="w-full sm:w-96">
                        @if (Str::startsWith($race->image_path, 'http'))
                            <img class="w-full h-96 object-cover rounded-md mb-4" src="{{ $race->image_path }}"
                                alt="{{ $race->title }}">
                        @else
                            <img class="w-full h-96 object-cover rounded-md mb-4"
                                src="{{ env('APP_URL') . '/' . ltrim($race->image_path, '/') }}"
                                alt="{{ $race->title }}">
                        @endif

                        <div class="flex flex-col sm:flex-row justify-between mb-4 font-bold">
                            <h2 class="flex items-center gap-2 font-[400] text-center text-lg capitalize"><i
                                    class="fa-solid fa-sliders"></i> Edição: <p class="font-bold">
                                    {{ $race->edition }}</p>
                            </h2>
                            <h2 class="flex items-center gap-2 font-[400] text-center text-lg capitalize"><i
                                    class="fa-solid fa-earth-europe"></i> Distrito: <p class="font-bold">
                                    {{ $race->district }}</p>
                            </h2>
                        </div>

                        <div class="flex flex-col gap-12 pb-4">
                            <div class="bg-gray-200 flex items-center gap-5 p-4 rounded-md shadow-sm">
                                <div class="w-full">
                                    @php
                                        $monthTranslations = [
                                            1 => 'Janeiro',
                                            2 => 'Fevereiro',
                                            3 => 'Março',
                                            4 => 'Abril',
                                            5 => 'Maio',
                                            6 => 'Junho',
                                            7 => 'Julho',
                                            8 => 'Agosto',
                                            9 => 'Setembro',
                                            10 => 'Outubro',
                                            11 => 'Novembro',
                                            12 => 'Dezembro',
                                        ];

                                        $accessibility_translation = '';
                                        $accessibility_translation =
                                            $race->has_accessibility == 1 ? 'Ativa' : 'Desativada';

                                        $condition_translation = '';
                                        switch ($race->minimum_condition) {
                                            case 'beginner':
                                                $condition_translation = 'Iniciante';
                                                break;
                                            case 'experienced':
                                                $condition_translation = 'Experiente';
                                                break;
                                            case 'advanced':
                                                $condition_translation = 'Avançado';
                                                break;
                                            default:
                                                $condition_translation = $race->minimum_condition;
                                        }
                                    @endphp

                                    <p class="font-bold text-lg mb-3">
                                        Data:
                                        {{ strftime('%e de ', strtotime($race->date)) . $monthTranslations[date('n', strtotime($race->date))] . strftime(' de %Y', strtotime($race->date)) }}
                                    </p>

                                    <p>Condição Mínima: {{ $condition_translation }}</p>
                                    <p>Horário:
                                        {{ date('H:i', strtotime($race->start_time)) }}

                                        @if ($race->end_time)
                                            - {{ date('H:i', strtotime($race->end_time)) }}
                                        @endif
                                    </p>
                                    <p>Acessibilidade: {{ $accessibility_translation }}</p>

                                    <p class="mt-4">Descrição: <span
                                            class="font-bold">{{ $race->description }}</span></p>
                                </div>
                            </div>
                        </div>

                        @if (Auth::check())
                            @php
                                $isParticipating = false;
                                foreach ($participations as $participation) {
                                    if ($participation->race_id == $race->id) {
                                        $isParticipating = true;
                                        break;
                                    }
                                }
                            @endphp

                            @if ($isParticipating)
                                <a class="mt-4" href="{{ route('leave_race', ['race_id' => $race->id]) }}">
                                    <x-new-button class="bg-red-600">
                                        CANCELAR INSCRIÇÃO
                                    </x-new-button>
                                </a>
                            @else
                                <a class="mt-4" href="{{ route('join_race', ['race_id' => $race->id]) }}">
                                    <x-new-button class="bg-green-600">
                                        INSCREVER-ME
                                    </x-new-button>
                                </a>
                            @endif
                        @else
                            <a class="mt-4" href="{{ route('login') }}">
                                <x-new-button>
                                    INICIAR SESSÃO
                                </x-new-button>
                            </a>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-app-layout>
