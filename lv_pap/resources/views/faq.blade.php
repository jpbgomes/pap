<x-app-layout>
    <div class="py-8 bg-gray-100">
        <div class="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div>
                <x-authentication-card-logo />
            </div>

            <div class="w-full sm:max-w-2xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg prose">
                <div id="runner_type">
                    <h1>Tipo de Corredor</h1>
                    
                    <div>
                        <h4>Como devo escolher o tipo de corredor?</h4>
                        <p>Se visa guiar os outros, emprestando os seus olhos, deve registar-se como guia. Caso contrário, como atleta.</p>
                    </div>
                </div>

                <br>

                <div id="condition">
                    <h1>Condição Atual</h1>

                    <div>
                        <h4>Como devo escolher o tipo de condição atual?</h4>
                        <p>Os tipos de corredores variam entre iniciante, experiente e avançado.<br>Por favor escolha a opção que mais se adequa a sí.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
