<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { useGlobalPageData } from '$lib/utils/useGlobalPageData'

	let loading = false
	let loginForm: HTMLFormElement

	const { supabase } = useGlobalPageData()

	let emailInput: HTMLInputElement
	let passwordInput: HTMLInputElement

	const handleSubmit: SubmitFunction = async (event) => {
		loading = true
		await supabase.auth.signInWithPassword({
			email: emailInput.value,
			password: passwordInput.value
		})
		loading = false
		window.location.reload()
	}
</script>

<form method="POST" use:enhance={handleSubmit} bind:this={loginForm} class="w-full max-w-sm">
	<div class="card shadow-2xl bg-base-100">
		<div class="card-body">
			<div class="form-control">
				<label for="email" class="label">
					<span class="label-text">Email Address</span>
				</label>
				<input
					required
					id="email"
					type="email"
					name="email"
					class="input input-bordered"
					placeholder="Enter email address"
					bind:this={emailInput}
				/>
			</div>
			<div class="form-control">
				<label for="password" class="label">
					<span class="label-text">Password</span>
				</label>
				<input
					required
					id="password"
					type="password"
					name="password"
					placeholder="Enter password"
					class="input input-bordered"
					bind:this={passwordInput}
				/>
				<!-- <label class="label">
						<a href="#" class="label-text-alt link link-hover">Forgot password?</a>
					</label> -->
			</div>
			<div class="form-control mt-6">
				<button type="submit" class="btn btn-primary">{loading ? 'Loading...' : 'Login'}</button>
				<a href="/" class="link link-hover mt-2 text-center">Home</a>
			</div>
		</div>
	</div>
</form>
