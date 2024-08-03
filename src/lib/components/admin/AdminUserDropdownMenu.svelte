<script lang="ts">
	import { page } from '$app/stores'
	import * as Avatar from '@ui/avatar'
	import { Button } from '@ui/button'
	import * as DropdownMenu from '@ui/dropdown-menu'

	const { supabase } = $page.data

	const onClickSignOut = async () => {
		if (!confirm('Are you sure to sign out?')) return
		await supabase.auth.signOut()
		location.reload()
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			size="icon"
			variant="ghost"
			builders={[builder]}
			class="relative rounded-full p-0"
		>
			<Avatar.Root class="h-full w-full">
				<Avatar.Image
					src={$page.data.user?.user_metadata.thumbnail}
					alt={$page.data.user?.user_metadata.name}
				/>
				<Avatar.Fallback>RK</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex items-center space-x-3">
				<Avatar.Root class="h-9 w-9">
					<Avatar.Image
						src={$page.data.user?.user_metadata.thumbnail}
						alt={$page.data.user?.user_metadata.name}
					/>
					<Avatar.Fallback>RK</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none">
						{$page.data.user?.user_metadata.name}
					</p>
					<p class="text-xs leading-none text-muted-foreground">
						{$page.data.user?.email}
					</p>
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Billing
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Settings
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>New Team</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={onClickSignOut}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
