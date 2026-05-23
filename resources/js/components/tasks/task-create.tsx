import {ClipboardCopy} from "lucide-react";
import ButtonText from "@/components/buttons/button-text";
import ModalCast from "../modals/modal-cast";
import CustomModal from "../modals/custom-modal";
import Button from "@/components/buttons/button";
import ModalSection from "../modals/modal-section";
import GeneralInput from "@/components/form/general-input";
import {RouteQueryOptions} from "@/wayfinder";
import {IProject, IServerResponse} from "@/types";
import {store as taskStore} from "@/actions/App/Http/Controllers/TaskController";
import {Dispatch, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";

export default function TaskCreateModal({showModal, setShowModal, project}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    project: IProject,
}) {
    const {t} = useTranslation(['projects', 'errors']);

    const [taskTitle, setTaskTitle] = useState<string>('');

    const [taskDescription, setTaskDescription] = useState<string>('');
    const [taskDueDate, setTaskDueDate] = useState<string>('');
    const [taskDueTime, setTaskDueTime] = useState<string>('');
    const [minParticipations, setMinParticipations] = useState<number | null>(null);

    const [formError, setFormError] = useState({
        title: true,
        'description': true,
        'due_date': true,
        'due_time': true,
        'min_participations': false,
    });

    const [storeResponse, setStoreResponse] = useState<IServerResponse>({
        success: false,
        error: {key: '', params: {}}
    });

    // const testArray = ['ara', 'bill', 'case', 'dice'];
    // const [testItems, setTestItems] = useState<Array<string>>([]);

    async function store(e: Event) {
        e.preventDefault();
        // TODO check if fields still have errors
        // if (!(formError.title || formError.description || formError.due_date || formError.due_time || formError.min_participations)) {
        const sendCreateData = async () => {
            try {
                const queryOptions: RouteQueryOptions = {
                    query: {
                        "project_id": project.id,
                        "title": taskTitle,
                        "description": taskDescription,
                        "due_at": `${taskDueDate} ${taskDueTime}`,
                        "min_participations": minParticipations?.toString() ?? null
                    }
                }

                const response = await fetch(taskStore(queryOptions).url);
                const data: IServerResponse = await response.json();
                setStoreResponse(data);
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        sendCreateData().then((value) => {
            if (value?.success) {
                setTaskTitle('');
                setTaskDescription('');
                setTaskDueDate('');
                setTaskDueTime('');
                setMinParticipations(null);
                // TODO Toast if successful. Also if error?
            }
        });
        // }
    }

    return (
        <CustomModal showModal={showModal} setShowModal={setShowModal} id="task-create">
            <ModalCast title={t('task_create_for_project', {project: project.name})}
                       closeModal={() => setShowModal(false)} className="w-full"
                       element="form">
                <ModalSection as="fieldset" title={t('task_base_informations')}>
                    <input type="hidden" name="project_id" id="project_id" value={project.id}/>
                    <GeneralInput name="task_name" label={t('task_form_title')}
                                  placeholder={t('task_form_title_placeholder')}
                                  validationRules={['min-6']} hasError={(error) => {
                        formError.title = error;
                        setFormError(formError);
                    }}
                                  value={taskTitle} setValue={setTaskTitle} required={true} autoFocus={true}/>
                    <GeneralInput name="task_desc" label={t('task_form_description')} type="textarea"
                                  placeholder={t('task_form_description_placeholder')}
                                  validationRules={['min-6']} hasError={(error) => {
                        formError.description = error;
                        setFormError(formError);
                    }}
                                  value={taskDescription} setValue={setTaskDescription} required={true}/>
                </ModalSection>
                <ModalSection as="fieldset" title={t('task_form_date')} className="grid grid-cols-2 gap-2">
                    {/* TODO switch
                        <div className="flex">
                            <span className="mr-auto">{t('task_form_starting_time')}</span>
                            <button />
                        </div>*/}
                    <GeneralInput name="due_date" label={t('task_form_due_date')} type="date" required={true}
                                  value={taskDueDate} hasError={(error) => {
                        formError.due_date = error;
                        setFormError(formError)
                    }} setValue={setTaskDueDate}/>
                    <GeneralInput name="due_time" label={t('task_form_due_time')} type="time" required={true}
                                  value={taskDueTime} hasError={(error) => {
                        formError.due_time = error;
                        setFormError(formError)
                    }} setValue={setTaskDueTime}/>

                    {/*<label htmlFor="due_date" className="flex flex-col gap-1">
                            <input type="text" list="test" className="input" onBlur={(e) => {
                                if (testArray.includes(e.currentTarget.value) && !testItems.includes(e.currentTarget.value)) {
                                    testItems.push(e.currentTarget.value);
                                    setTestItems(testItems);
                                    e.currentTarget.value = '';
                                } else e.currentTarget.classList.add('input_error');
                            }}/>

                            <datalist id="test">
                                {
                                    testArray.map((item) => {
                                        return (
                                            <option value={item} key={item}>{item}</option>
                                        );
                                    })
                                }
                            </datalist>
                        </label>
                        <ul>
                            {testItems.length > 0 ? testItems.map((item) => {
                                    return <li key={item.id} onClick={() => {
                                        setTestItems(testItems.splice(testItems.indexOf(item), 1));
                                    }}>{item}</li>
                                })
                                : null
                            }
                        </ul>*/}
                </ModalSection>
                <ModalSection as="fieldset">
                    <GeneralInput name="min_participations" label={t('form_min_participations')}
                                  value={minParticipations?.toString() ?? ''} setValue={setMinParticipations}
                                  type="number" validationRules={['int']} hasError={(error) => {
                        formError.min_participations = error;
                        setFormError(formError);
                    }}
                    />
                </ModalSection>
                <div className="flex flex-col gap-3 px-2">
                    <Button textContent={t('task_create_button')} type="submit" onClick={store}/>
                    {storeResponse.error ? <span
                        className={storeResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + storeResponse.error.key, storeResponse.error.params)}</span> : null}
                    <ButtonText icon={ClipboardCopy} textContent={t('task_create_fill')}/>
                </div>
            </ModalCast>
        </CustomModal>
    );
}
