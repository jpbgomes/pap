<x-guest-layout>
    <x-authentication-card>
        <x-slot name="logo">
            <x-authentication-card-logo />
        </x-slot>

        <div class="mb-4 text-sm text-gray-600">
            {{ __("Esqueceu-se da sua password? Não há problema. Basta introduzir o seu endereço de email e enviaremos um link de reposição que lhe permitirá escolher uma nova.") }}
        </div>

        @if (session('status'))
            <div class="mb-4 font-medium text-sm text-green-600">
                {{ session('status') }}
            </div>
        @endif

        <x-validation-errors class="mb-4" />

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <div class="block">
                <x-label for="email" value="{{ __('Email') }}" />
                <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            </div>

            <div class="flex items-center justify-between mt-4">
                <x-secondary-button>
                    <a href="{{ route('welcome') }}" :active="request()->routeIs('welcome')">
                        Retornar
                    </a>
                </x-secondary-button>


                <x-button>
                    {{ __('Enviar Email') }}
                </x-button>
            </div>
        </form>
    </x-authentication-card>
</x-guest-layout>
