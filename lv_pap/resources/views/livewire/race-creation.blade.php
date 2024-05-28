<form wire:submit.prevent="save">
    <div class="mt-0 flex items-center gap-3">
        <div class="w-full">
            <x-label for="titulo" value="{{ __('Nome:') }}" />
            <x-input id="titulo" class="block mt-1 w-full" type="text" wire:model.defer="titulo" required />
        </div>
    </div>

    <div class="mt-8">
        <x-label for="descricao" value="{{ __('Descrição:') }}" />
        <x-input id="descricao" class="block mt-1 w-full" type="text" wire:model.defer="descricao" required />
    </div>

    <div class="mt-8">
        <x-label for="distrito" value="{{ __('Distrito:') }}" />
        <select wire:model.defer="distrito" id="distrito" name="distrito"
            class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
            <option value="">Distrito</option>
            <option value="aveiro">Aveiro</option>
            <option value="beja">Beja</option>
            <option value="braga">Braga</option>
            <option value="bragança">Bragança</option>
            <option value="castelo_branco">Castelo Branco</option>
            <option value="coimbra">Coimbra</option>
            <option value="evora">Évora</option>
            <option value="faro">Faro</option>
            <option value="guarda">Guarda</option>
            <option value="leiria">Leiria</option>
            <option value="lisboa">Lisboa</option>
            <option value="portalegre">Portalegre</option>
            <option value="porto">Porto</option>
            <option value="santarem">Santarém</option>
            <option value="setubal">Setúbal</option>
            <option value="viana_do_castelo">Viana do Castelo</option>
            <option value="vila_real">Vila Real</option>
            <option value="viseu">Viseu</option>
        </select>
    </div>

    <div class="mt-8">
        @if ($foto)
            Preview:
            <img style="max-width: 20rem;" class="m-0 rounded-md mb-4" src="{{ $foto->temporaryUrl() }}">
        @endif

        <input class="hidden" type="file" id="fileInput" wire:model="foto">
        <label for="fileInput">
            Clica aqui para adicionares uma Imagem
        </label>
    </div>

    <div class="mt-8 flex tele:flex-col items-center gap-3">
        <div class="w-full">
            <x-label for="data" value="{{ __('Data:') }}" />
            <x-input id="data" class="block mt-1 w-full" type="date" wire:model.defer="data" required />
        </div>

        <div class="w-full">
            <x-label for="hora_partida" value="{{ __('Hora de Partida:') }}" />
            <x-input id="hora_partida" class="block mt-1 w-full" type="time" wire:model.defer="hora_partida"
                required />
        </div>

        <div class="w-full">
            <x-label for="hora_chegada" value="{{ __('Hora de Chegada:') }}" />
            <x-input id="hora_chegada" class="block mt-1 w-full" type="time" wire:model.defer="hora_chegada"
                required />
        </div>
    </div>

    <div class="mt-8">
        <x-label for="condicao_minima" value="{{ __('Condição Mínima:') }}" />
        <select wire:model.defer="condicao_minima" id="condicao_minima" name="condicao_minima"
            class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
            <option value="">Condição Mínima</option>
            <option value="beginner">Iniciante</option>
            <option value="experienced">Experiente</option>
            <option value="advanced">Avançado</option>
        </select>
    </div>

    <div class="mt-8">
        <x-label for="tem_acessibilidade" value="{{ __('Tem Acessibilidade:') }}" />
        <select wire:model.defer="tem_acessibilidade" id="tem_acessibilidade" name="tem_acessibilidade"
            class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
            <option value="">Tem Acessibilidade</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
        </select>
    </div>

    <div class="mt-8">
        <x-new-button>
            CRIAR CORRIDA
        </x-new-button>
    </div>

    @if ($errors->any())
        <p class="font-bold text-md text-center text-red-600 mt-4"> {{ $errors->first() }} </p>
    @endif

    @if (session()->has('success'))
        <p class="font-bold text-md text-center text-green-600 mt-4"> {{ session()->get('success') }} </p>
    @endif
</form>
