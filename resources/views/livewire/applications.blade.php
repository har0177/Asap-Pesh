<div class="bg-white border border-gray-200 rounded-lg shadow-lg">
	@if (session()->has('success'))
        <x-flash-success-message message="{{ session('success') }}"/>
    @endif
    @if (session()->has('error'))
        <x-flash-error-message message="{{ session('error') }}"/>
    @endif



    @if($admitPanel)
        <div class="bg-indigo-600 py-4 px-6 flex items-center justify-between">
            <h1 class="text-xl text-white font-semibold">Admit {{$first_name. ' '. $last_name}} as a Student</h1>

        </div>

        <form class="py-6 px-4 sm:px-6" wire:submit.prevent="saveAdmit">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">


                <div>
                    <label for="diploma_id" class="block text-sm font-medium text-gray-700 mb-1">Admit In
                        Diploma</label>
                    <div class="relative">
                        <select name="type" disabled id="diploma_id" wire:model="diploma_id"
                                class="select2 block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option>Select Diploma</option>
                            @foreach($diplomaList as $diploma)
                                <option
                                    value="{{$diploma->id}}" @selected($diploma->id === $diploma_id)>{{$diploma->name}}</option>
                            @endforeach
                        </select>

                    </div>
                    @error('diploma_id')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror

                </div>


                <div>
                    <label for="section_id" class="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <div class="relative">
                        <select name="type" id="section_id" wire:model="section_id"
                                class="select2 block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option>Select Section</option>
                            @foreach($sectionList as $sec)
                                <option value="{{$sec->id}}">{{$sec->name}}</option>
                            @endforeach
                        </select>

                    </div>
                    @error('session_id')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror

                </div>

                <div>
                    <label for="session_id" class="block text-sm font-medium text-gray-700 mb-1">Session</label>
                    <div class="relative">
                        <select name="type" id="session_id" wire:model.live="session_id"
                                wire:change="getClassNumber"
                                class="select2 block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option>Select Session</option>
                            @foreach($sessionList as $session)
                                <option value="{{$session->id}}">{{$session->name}}</option>
                            @endforeach
                        </select>

                    </div>
                    @error('session_id')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror

                </div>


                <div>
                    <label for="reg_no" class="block text-sm font-medium text-gray-700 mb-1">Assign Registration
                        #</label>
                    <input id="reg_no" name="reg_no" type="text" wire:model="reg_no"
                           class="appearance-none rounded-md block w-full px-3 py-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           placeholder="ASA001">
                    @error('reg_no')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror

                </div>

                <div>
                    <label for="class_no" class="block text-sm font-medium text-gray-700 mb-1">Assign Class #</label>
                    <input id="class_no" name="class_no" type="text" wire:model="class_no"
                           class="appearance-none rounded-md block w-full px-3 py-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           placeholder="001">
                    @error('class_no')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror

                </div>


                <div>
                    <label for="admission_date" class="block text-sm font-medium text-gray-700 mb-1">Admission
                        Date</label>
                    <input id="admission_date" name="admission_date" type="date" wire:model="admission_date"
                           class="appearance-none rounded-md block w-full px-3 py-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    @error('admission_date')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            <button type="submit"
                    wire:loading.attr="disabled"
                    class="mt-6 max-w-md bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-white">
                <span wire:loading wire:target="saveAdmit">Saving...</span>
                <span wire:loading.remove wire:target="saveAdmit">Submit</span>
            </button>

        </form>

    @elseif($applyPanel)
        <div class="bg-indigo-600 py-4 px-6 flex items-center justify-between rounded-t-lg">
            <h1 class="text-xl text-white font-semibold">Apply for {{$diplomaName}}</h1>
            <div class="text-white">
                Application #: {{$application_number}} &nbsp; &nbsp; Status: {{$status}}
            </div>
        </div>
        <!-- Card Body -->
        <form class="py-6 px-4 sm:px-6" wire:submit.prevent="updateApplication">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name field -->

                <span>
						<label class="relative flex items-center">
					<input type="checkbox"
                           id="open-merit"
                           name="quota[]"
                           value="33"
                           wire:model="quota"
                           class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer">
					<span class="ml-8">Open Merit</span>
				</label>
	</span>

                <div class="mb-4">
                    <label for="toggleQuota" class="block text-sm font-medium text-gray-700 mb-1">Select Quota to
                        Apply</label>
                    <div class="space-y-2">
                        @foreach($quotaList as $list)
                            <label class="relative flex items-center">
                                <input type="checkbox"
                                       id="{{ str_slug($list->name) }}"
                                       name="quota[]"
                                       value="{{$list->id}}"
                                       wire:model="quota"
                                       class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer">
                                <span class="ml-8">{{$list->name}}</span>
                            </label>
                        @endforeach
                    </div>
                    @error('quota')
                    <span class="text-red-600 text-sm">{{ $message }}</span>
                    @enderror
                </div>

            </div>
            <button type="submit"
                    wire:loading.attr="disabled"
                    class="mt-6 max-w-md bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-white">
                <span wire:loading wire:target="updateApplication">Saving...</span>
                <span wire:loading.remove wire:target="updateApplication">Submit</span>
            </button>
            <x-button type="button" wire:click="toggleSection">
                Reset
            </x-button>

        </form>

    @else

        <div class="bg-indigo-600 py-4 px-6 flex items-center justify-between">
            <h1 class="text-xl text-white font-semibold">Applications Management</h1>
            <div class="flex justify-end mb-4">
                <button wire:click="export"
                        class="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-4 py-2">
                    <i class="fas fa-file-excel"></i> Export Excel
                </button>
            </div>
        </div>
        <!-- Card Body -->
        <div class="mt-5 px-8">
            <div class="flex justify-between">
                <div class="p-4">
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search By Application # /
                        Name</label>
                    <input type="search" wire:model.live.debounce.500ms="search" placeholder="Search"
                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
                </div>
                <div class="p-4">

                    <label for="diploma_search" class="block text-sm font-medium text-gray-700 mb-1">Search By
                        Diploma</label>
                    <div class="diploma_search">
                        <select name="diploma_search" id="diploma_search"
                                wire:change="loadSections"
                                wire:model.live="diploma_search"
                                class=" block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value="">Select Diploma</option>
                            @foreach($diplomaList as $list)
                                <option value="{{$list->id}}">{{$list->name}}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="p-4">

                    <label for="quota_search" class="block text-sm font-medium text-gray-700 mb-1">Search By
                        Quota</label>
                    <div class="quota_search">
                        <select name="gender" id="quota_search" wire:model.live="quota_search"
                                class=" block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value="">Select Quota</option>
                            @foreach($quotaSearchList as $list)
                                <option value="{{$list->id}}">{{$list->name}}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="mr-2 mt-8">
                    <input type="checkbox" class="mr-2 leading-tight" wire:model.live="paid"/> Payment Paid Only ?
                </div>

            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="bg-gray-200">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                No
                                <x-sorting name="id"/>
                            </div>
                        </th>

                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Application #
                            </div>
                        </th>

                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Full Name
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Father Name
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Applied For
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Documents
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Quota Applied
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                District
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Payment Status
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Action
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    @forelse($applications as $application)
                        <tr class="{{ $loop->even ? 'bg-gray-100' : 'bg-white' }}">
                            <td class="border px-4 py-2">{{ $loop->index + 1  }}</td>
                            <td class="border px-4 py-2">{{ $application->application_number }}</td>
                            <td class="border px-4 py-2">{{ $application->user->full_name }}</td>
                            <td class="border px-4 py-2">{{ $application->user->student->father_name }}</td>
                            <td class="border px-4 py-2">{{ $application->project->diploma->name}}</td>
                            <td class="border px-4 py-2">
                                <a href="{{ route('print-challan', ['application' => $application->id]) }}"
                                   target="_blank"
                                   class="text-blue-500 hover:underline">Fee Challan</a>

                                @if ($application->user->hasMedia('dmc'))
                                    <a href="{{ $application->user->getFirstMediaUrl('dmc') }}" target="_blank"
                                       class="text-blue-500 hover:underline">DMC (Matric)</a>
                                @endif
                                @if ($application->user->hasMedia('domicile'))
                                    <a href="{{ $application->user->getFirstMediaUrl('domicile') }}" target="_blank"
                                       class="text-blue-500 hover:underline">Domicile</a>
                                @endif
                                @if ($application->user->hasMedia('cnic'))
                                    <a href="{{ $application->user->getFirstMediaUrl('cnic') }}" target="_blank"
                                       class="text-blue-500 hover:underline">CNIC/FormB</a>
                                @endif
                                @if ($application->hasMedia('challan'))
                                    <a href="{{ $application->getFirstMediaUrl('challan') }}" target="_blank"
                                       class="text-blue-500 hover:underline">Challan</a>
                                @endif
                            </td>
                            <td class="border px-4 py-2">
                                <ul class="list-disc list-inside">

                                    @foreach ($application->quotaName as $quotaName)
                                        <li>{{ $quotaName }}</li>
                                    @endforeach
                                </ul>
                            </td>
                            <td class="border px-4 py-2">
                                <ul class="list-disc list-inside">
                                    {{$application->user->student->district->name}}
                                </ul>
                            </td>
                            <td class="border px-4 py-2">
                                @if ($application->status === 'Paid')
                                    <x-badge text="{{$application->status}}" color="green"/>
                                @else
                                    <x-badge text="{{$application->status}}" color="indigo"/>
                                @endif
                            </td>
                            <td class="border px-4 py-2">
                                <div class="flex h-full items-center">
                                    <a target="_blank" href="{{ route('print-form', ['application' => $application]) }}"
                                       class="inline-block ml-2 px-3 text-white py-1 bg-indigo-500 rounded-lg hover:bg-indigo-700 transition duration-300">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    @if($application->user->student->status === 'Pending')
                                        @if($application->status === 'Paid')
                                            <x-button class="ml-3 bg-indigo-500" title="Admit As a Student"
                                                      wire:click="admitAsStudent({{$application->id}})"
                                                      wire:loading.attr="disabled">
                                                <i class="fas fa-id-card"></i>
                                            </x-button>

                                        @else
                                            @can('payment application')
                                                @if($application->status !== 'Paid')
                                                    <div x-data="{ showModal: false }">
                                                        <!-- Trigger button -->
                                                        <x-button wire:click="changeStatus({{ $application->id }})"
                                                                  class="ml-3" @click="showModal = true">
                                                            <i class="fa-solid fa-dollar-sign"></i>
                                                        </x-button>

                                                        <!-- Modal -->
                                                        <div x-show="showModal"
                                                             class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                                            <div class="bg-white rounded shadow-lg w-80">
                                                                <div
                                                                    class="modal-header bg-indigo-600 text-white rounded-t">
                                                                    <div class="flex items-center justify-between p-3">
                                                                        <h5 class="text-lg font-semibold">Payment
                                                                            Status</h5>
                                                                        <button @click="showModal = false"
                                                                                class="text-white hover:text-gray-200">
                                                                            <span>&times;</span>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div class="modal-body p-4">
                                                                    <p class="text-gray-700">Are you sure you want to
                                                                        change the payment status to paid?</p>
                                                                </div>

                                                                <div
                                                                    class="modal-footer flex justify-end p-4 bg-gray-100 rounded-b">
                                                                    <button @click="showModal = false"
                                                                            class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
                                                                        Close
                                                                    </button>
                                                                    <button wire:click.prevent="paymentStatus()"
                                                                            @click="showModal = false"
                                                                            class="ml-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none">
                                                                        Yes, Proceed
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endif
                                            @endcan

                                        @endif
                                        @can('edit application')
                                            <x-button class="ml-3" wire:click="edit({{ $application->id}})"
                                                      wire:loading.attr="disabled">
                                                <i class="fas fa-pencil"></i>
                                            </x-button>
                                        @endcan
                                    @else
                                        <x-badge text="Admitted" color="indigo"/>
                                    @endif
                                </div>
                            </td>

                        </tr>
                    @empty
                        <tr>
                            <td class="border px-4 py-2" colspan="7">No Record Found.</td>
                        </tr>
                    @endforelse
                    </tbody>
                </table>
            </div>

        </div>
        <!-- Card Footer -->
        <div class="py-4 px-8">
            {{ $applications->links() }}
        </div>
    @endif
</div>
@push('scripts')
	<script>
	 Livewire.directive('confirm', ({ el, directive, component, cleanup }) => {
		 let content = directive.expression

		 let onClick = e => {
			 if (!confirm(content)) {
				 e.preventDefault()
				 e.stopImmediatePropagation()
			 }
		 }
		 el.addEventListener('click', onClick, { capture: true })
		 cleanup(() => {
			 el.removeEventListener('click', onClick)
		 })
	 })
	</script>

@endpush



