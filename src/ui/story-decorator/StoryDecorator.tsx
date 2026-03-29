import type { ComponentType, ReactElement } from 'react';
import styles from './StoryDecorator.module.scss';

export const StoryDecorator = (Story: ComponentType): ReactElement => (
	<div className={styles.storybookContainer}>
		<Story />
	</div>
);
